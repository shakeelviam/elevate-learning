"""
User profile routes — personal stats, weak topics, question history.
"""
from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import get_current_user
from app.database import get_conn
from app.schemas import QuestionHistoryItem, UserProfile, WeakTopic

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/me",
    response_model=UserProfile,
    summary="Full user profile with aggregate stats",
)
async def get_profile(
    current_user: dict[str, Any] = Depends(get_current_user),
) -> UserProfile:
    user_id = current_user["user_id"]

    with get_conn() as conn:
        with conn.cursor() as cur:
            # Base user info
            cur.execute(
                "SELECT id, email, username, created_at FROM users WHERE id = %s",
                (user_id,),
            )
            user_row = cur.fetchone()
            if not user_row:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

            # Session counts and average score
            cur.execute(
                """
                SELECT
                    COUNT(*) AS total_sessions,
                    COUNT(finished_at) AS completed_sessions,
                    AVG(score) AS avg_score
                FROM sessions WHERE user_id = %s
                """,
                (user_id,),
            )
            stats_row = cur.fetchone()

            # Top 5 weak topics
            cur.execute(
                """
                SELECT topic, miss_count, updated_at
                FROM weak_topics
                WHERE user_id = %s AND miss_count > 0
                ORDER BY miss_count DESC
                LIMIT 5
                """,
                (user_id,),
            )
            weak_rows = cur.fetchall()

    weak_topics = [
        WeakTopic(topic=r[0], miss_count=r[1], updated_at=r[2])
        for r in weak_rows
    ]

    return UserProfile(
        id=user_row[0],
        email=user_row[1],
        username=user_row[2],
        created_at=user_row[3],
        total_sessions=stats_row[0] or 0,
        completed_sessions=stats_row[1] or 0,
        avg_score=float(stats_row[2]) if stats_row[2] is not None else None,
        top_weak_topics=weak_topics,
    )


@router.get(
    "/me/weak-topics",
    response_model=list[WeakTopic],
    summary="Ranked list of weak topic areas",
    description=(
        "Returns topics sorted by miss count descending. "
        "The generation engine uses this to bias question retrieval."
    ),
)
async def get_weak_topics(
    current_user: dict[str, Any] = Depends(get_current_user),
    limit: int = 20,
) -> list[WeakTopic]:
    user_id = current_user["user_id"]
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT topic, miss_count, updated_at
                FROM weak_topics
                WHERE user_id = %s AND miss_count > 0
                ORDER BY miss_count DESC
                LIMIT %s
                """,
                (user_id, limit),
            )
            rows = cur.fetchall()
    return [WeakTopic(topic=r[0], miss_count=r[1], updated_at=r[2]) for r in rows]


@router.get(
    "/me/history",
    response_model=list[QuestionHistoryItem],
    summary="Paginated question answer history",
)
async def get_history(
    current_user: dict[str, Any] = Depends(get_current_user),
    limit: int = 50,
    offset: int = 0,
) -> list[QuestionHistoryItem]:
    user_id = current_user["user_id"]
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT question_md5, topic, difficulty, was_correct, answered_at, session_id
                FROM question_history
                WHERE user_id = %s
                ORDER BY answered_at DESC
                LIMIT %s OFFSET %s
                """,
                (user_id, limit, offset),
            )
            rows = cur.fetchall()
    return [
        QuestionHistoryItem(
            question_md5=r[0],
            topic=r[1],
            difficulty=r[2],
            was_correct=r[3],
            answered_at=r[4],
            session_id=r[5],
        )
        for r in rows
    ]
