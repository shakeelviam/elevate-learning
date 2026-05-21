"""
Scoring service — evaluates answers, persists results, updates weak topics.

Called exclusively by the sessions router after a user submits answers.
All database writes happen in a single connection so they're atomic.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from app.database import get_conn
from app.schemas import QuestionOptions, QuestionResult, SessionResult

logger = logging.getLogger(__name__)


def _load_session_questions(session_id: int) -> list[dict[str, Any]]:
    """Fetch all questions for a session from the DB."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT hash, question,
                       option_a, option_b, option_c, option_d,
                       correct, explanation, topic, difficulty, position
                FROM session_questions
                WHERE session_id = %s
                ORDER BY position
                """,
                (session_id,),
            )
            rows = cur.fetchall()

    return [
        {
            "hash": r[0],
            "question": r[1],
            "options": {"A": r[2], "B": r[3], "C": r[4], "D": r[5]},
            "correct": r[6],
            "explanation": r[7],
            "topic": r[8],
            "difficulty": r[9],
            "position": r[10],
        }
        for r in rows
    ]


def _upsert_weak_topic(cur: Any, user_id: int, topic: str, delta: int) -> None:
    """
    Increment (wrong answer) or decrement (correct answer) a weak-topic counter.
    Counter is floored at 0 — it never goes negative.
    """
    if not topic or not topic.strip():
        return
    cur.execute(
        """
        INSERT INTO weak_topics (user_id, topic, miss_count, updated_at)
        VALUES (%s, %s, GREATEST(0, %s), NOW())
        ON CONFLICT (user_id, topic) DO UPDATE
        SET miss_count = GREATEST(0, weak_topics.miss_count + %s),
            updated_at  = NOW()
        """,
        (user_id, topic.strip(), max(0, delta), delta),
    )


def evaluate_and_persist(
    session_id: int,
    user_id: int,
    answers: dict[str, str],
    started_at: datetime,
    exam_type: str = "",
) -> SessionResult:
    """
    Core scoring pipeline:
      1. Load stored questions (including correct answers) from the DB.
      2. Compare user answers to correct answers.
      3. Persist each answer to question_history.
      4. Update weak_topics (miss_count ±1 per topic).
      5. Finalise the session row (score, finished_at, total_q).
      6. Return a fully populated SessionResult.
    """
    stored = _load_session_questions(session_id)
    if not stored:
        from fastapi import HTTPException, status
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No questions found for session {session_id}.",
        )

    finished_at = datetime.now(timezone.utc)
    correct_count = 0
    question_results: list[QuestionResult] = []
    weak_topics_affected: list[str] = []

    with get_conn() as conn:
        with conn.cursor() as cur:
            for q in stored:
                user_ans = answers.get(q["hash"])
                is_correct = user_ans is not None and user_ans.upper() == q["correct"]
                if is_correct:
                    correct_count += 1

                # Persist to question_history
                cur.execute(
                    """
                    INSERT INTO question_history
                        (user_id, session_id, question_md5, topic, difficulty, was_correct)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """,
                    (
                        user_id,
                        session_id,
                        q["hash"],
                        q["topic"],
                        q["difficulty"],
                        is_correct,
                    ),
                )

                # Update weak topics
                delta = -1 if is_correct else 1
                _upsert_weak_topic(cur, user_id, q["topic"], delta)
                if q["topic"] and q["topic"] not in weak_topics_affected:
                    weak_topics_affected.append(q["topic"])

                question_results.append(
                    QuestionResult(
                        hash=q["hash"],
                        question=q["question"],
                        options=QuestionOptions(**q["options"]),
                        correct=q["correct"],  # type: ignore[arg-type]
                        user_answer=user_ans.upper() if user_ans else None,  # type: ignore[arg-type]
                        was_correct=is_correct,
                        explanation=q["explanation"],
                        topic=q["topic"],
                        difficulty=q["difficulty"],
                    )
                )

            total = len(stored)
            score_pct = round((correct_count / total) * 100, 2) if total else 0.0

            # Finalise session
            cur.execute(
                """
                UPDATE sessions
                SET score = %s, finished_at = %s, total_q = %s
                WHERE id = %s AND user_id = %s
                """,
                (score_pct, finished_at, total, session_id, user_id),
            )

    logger.info(
        "Session %d scored: %d/%d = %.1f%% for user %d",
        session_id, correct_count, total, score_pct, user_id,
    )

    return SessionResult(
        session_id=session_id,
        exam_type=exam_type,
        score_pct=score_pct,
        correct_count=correct_count,
        total_count=total,
        started_at=started_at,
        finished_at=finished_at,
        questions=question_results,
        weak_topics_updated=weak_topics_affected,
    )
