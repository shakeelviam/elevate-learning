"""
Session routes — start a test, submit answers, fetch results and history.

Flow:
  POST /sessions/start
    → generates questions via RAG, stores correct answers in session_questions,
      returns QuestionPublic (no correct answer exposed).

  POST /sessions/{id}/submit
    → receives user answers, evaluates via scoring service, updates
      question_history + weak_topics, finalises the session row.

  GET  /sessions/
    → list all sessions for the current user (summary only).

  GET  /sessions/{id}/result
    → full result for a completed session (questions + correct answers).
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import get_current_user
from app.database import get_conn
from app.schemas import (
    QuestionPublic,
    SessionResult,
    SessionStartRequest,
    SessionStartResponse,
    SessionSummary,
    SubmitRequest,
)
from app.services import question_gen
from app.services.scoring import evaluate_and_persist
from app.schemas import GenerateRequest

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/sessions", tags=["sessions"])


# ── Helpers ───────────────────────────────────────────────────────────────────

def _create_session(user_id: int, exam_type: str) -> tuple[int, datetime]:
    """Insert a new session row, return (session_id, started_at)."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO sessions (user_id, exam_type) VALUES (%s, %s) "
                "RETURNING id, started_at",
                (user_id, exam_type),
            )
            row = cur.fetchone()
    return row[0], row[1]


def _store_questions(session_id: int, questions: list[Any]) -> None:
    """Persist generated questions (with correct answers) to session_questions."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            for pos, q in enumerate(questions):
                cur.execute(
                    """
                    INSERT INTO session_questions
                        (session_id, hash, question,
                         option_a, option_b, option_c, option_d,
                         correct, explanation, topic, difficulty, position)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    """,
                    (
                        session_id,
                        q.hash,
                        q.question,
                        q.options.A,
                        q.options.B,
                        q.options.C,
                        q.options.D,
                        q.correct,
                        q.explanation,
                        q.topic,
                        q.difficulty,
                        pos,
                    ),
                )


def _get_session_meta(session_id: int, user_id: int) -> dict[str, Any]:
    """Fetch a session row, raising 404/403 as appropriate."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, user_id, exam_type, started_at, finished_at, score, total_q "
                "FROM sessions WHERE id = %s",
                (session_id,),
            )
            row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found.")
    if row[1] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your session.")
    return {
        "id": row[0],
        "user_id": row[1],
        "exam_type": row[2],
        "started_at": row[3],
        "finished_at": row[4],
        "score": row[5],
        "total_q": row[6],
    }


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post(
    "/start",
    response_model=SessionStartResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Start a new practice session",
    description=(
        "Generates questions via the RAG pipeline and stores them server-side. "
        "Returns questions WITHOUT the correct answer — those are only revealed after submission."
    ),
)
async def start_session(
    body: SessionStartRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
) -> SessionStartResponse:
    user_id = current_user["user_id"]

    # Pull existing seen hashes so we don't repeat questions across sessions
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT DISTINCT question_md5 FROM question_history WHERE user_id = %s",
                (user_id,),
            )
            seen_hashes = [r[0] for r in cur.fetchall()]

    gen_req = GenerateRequest(
        exam_type=body.exam_type,
        count=body.count,
        difficulty=body.difficulty,
        weak_topics=body.weak_topics,
        topic_hint=body.topic_hint,
        seen_hashes=seen_hashes,
    )

    gen_result = await question_gen.generate_questions(gen_req)
    if not gen_result.questions:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="No questions were generated. Check that Ollama is running and a model is loaded.",
        )

    session_id, started_at = _create_session(user_id, body.exam_type)
    _store_questions(session_id, gen_result.questions)

    public_questions = [
        QuestionPublic(
            hash=q.hash,
            question=q.question,
            options=q.options,
            topic=q.topic,
            difficulty=q.difficulty,
            position=i,
        )
        for i, q in enumerate(gen_result.questions)
    ]

    logger.info(
        "Session %d started — user %d, exam=%s, %d questions",
        session_id, user_id, body.exam_type, len(public_questions),
    )
    return SessionStartResponse(
        session_id=session_id,
        exam_type=body.exam_type,
        questions=public_questions,
        time_limit_minutes=body.time_limit_minutes,
        started_at=started_at,
    )


@router.post(
    "/{session_id}/submit",
    response_model=SessionResult,
    summary="Submit answers and receive scored results",
    description=(
        "Evaluates each answer against the server-stored correct values. "
        "Returns full results including correct answers, explanations, and updated weak topics."
    ),
)
async def submit_session(
    session_id: int,
    body: SubmitRequest,
    current_user: dict[str, Any] = Depends(get_current_user),
) -> SessionResult:
    user_id = current_user["user_id"]
    meta = _get_session_meta(session_id, user_id)

    if meta["finished_at"] is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This session has already been submitted.",
        )

    result = evaluate_and_persist(
        session_id=session_id,
        user_id=user_id,
        answers=body.answers,
        started_at=meta["started_at"],
        exam_type=meta["exam_type"],
    )
    return result


@router.get(
    "/",
    response_model=list[SessionSummary],
    summary="List all sessions for the current user",
)
async def list_sessions(
    current_user: dict[str, Any] = Depends(get_current_user),
    limit: int = 20,
    offset: int = 0,
) -> list[SessionSummary]:
    user_id = current_user["user_id"]
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, exam_type, score, total_q, started_at, finished_at
                FROM sessions
                WHERE user_id = %s
                ORDER BY started_at DESC
                LIMIT %s OFFSET %s
                """,
                (user_id, limit, offset),
            )
            rows = cur.fetchall()

    return [
        SessionSummary(
            session_id=r[0],
            exam_type=r[1],
            score_pct=float(r[2]) if r[2] is not None else None,
            total_q=r[3],
            started_at=r[4],
            finished_at=r[5],
        )
        for r in rows
    ]


@router.get(
    "/{session_id}/result",
    response_model=SessionResult,
    summary="Get the full scored result for a completed session",
)
async def get_result(
    session_id: int,
    current_user: dict[str, Any] = Depends(get_current_user),
) -> SessionResult:
    user_id = current_user["user_id"]
    meta = _get_session_meta(session_id, user_id)

    if meta["finished_at"] is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Session not yet submitted. POST to /{id}/submit first.",
        )

    # Re-load questions + history to build the result
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT sq.hash, sq.question,
                       sq.option_a, sq.option_b, sq.option_c, sq.option_d,
                       sq.correct, sq.explanation, sq.topic, sq.difficulty,
                       qh.was_correct,
                       (SELECT question_md5 FROM question_history
                        WHERE session_id = %s AND question_md5 = sq.hash
                        ORDER BY answered_at DESC LIMIT 1) as answered_hash
                FROM session_questions sq
                LEFT JOIN question_history qh
                    ON qh.session_id = %s AND qh.question_md5 = sq.hash
                WHERE sq.session_id = %s
                ORDER BY sq.position
                """,
                (session_id, session_id, session_id),
            )
            rows = cur.fetchall()

    from app.schemas import QuestionOptions, QuestionResult

    questions = []
    correct_count = 0
    for r in rows:
        was_correct = bool(r[10]) if r[10] is not None else False
        if was_correct:
            correct_count += 1
        questions.append(
            QuestionResult(
                hash=r[0],
                question=r[1],
                options=QuestionOptions(A=r[2], B=r[3], C=r[4], D=r[5]),
                correct=r[6],  # type: ignore[arg-type]
                user_answer=None,
                was_correct=was_correct,
                explanation=r[7],
                topic=r[8],
                difficulty=r[9],
            )
        )

    total = len(questions)
    return SessionResult(
        session_id=session_id,
        exam_type=meta["exam_type"],
        score_pct=float(meta["score"]) if meta["score"] is not None else 0.0,
        correct_count=correct_count,
        total_count=total,
        started_at=meta["started_at"],
        finished_at=meta["finished_at"],
        questions=questions,
        weak_topics_updated=[],
    )
