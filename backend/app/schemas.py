"""
Shared Pydantic schemas — all request/response models in one place.
"""
from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, field_validator


# ─────────────────────────────────────────────────────────────────────────────
# MCQ primitives (shared by generation + session schemas)
# ─────────────────────────────────────────────────────────────────────────────

class QuestionOptions(BaseModel):
    A: str
    B: str
    C: str
    D: str


class Question(BaseModel):
    """Full question including correct answer — used internally and in scoring."""
    question: str
    options: QuestionOptions
    correct: Literal["A", "B", "C", "D"]
    explanation: str
    topic: str = ""
    difficulty: Literal["easy", "medium", "hard"] = "medium"
    hash: str = ""


class QuestionPublic(BaseModel):
    """Question sent to the client during an active test — no correct answer."""
    hash: str
    question: str
    options: QuestionOptions
    topic: str
    difficulty: Literal["easy", "medium", "hard"]
    position: int


class QuestionResult(BaseModel):
    """Question with outcome — returned after session submission."""
    hash: str
    question: str
    options: QuestionOptions
    correct: Literal["A", "B", "C", "D"]
    user_answer: Literal["A", "B", "C", "D"] | None
    was_correct: bool
    explanation: str
    topic: str
    difficulty: str


# ─────────────────────────────────────────────────────────────────────────────
# Generation (Phase 2)
# ─────────────────────────────────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    exam_type: str = Field(default="IELTS", examples=["IELTS"])
    count: int = Field(default=5, ge=1, le=20)
    difficulty: Literal["easy", "medium", "hard"] = "medium"
    weak_topics: list[str] = Field(default_factory=list)
    seen_hashes: list[str] = Field(default_factory=list)
    topic_hint: str = ""


class GenerateResponse(BaseModel):
    questions: list[Question]
    context_chunks_used: int
    model_used: str
    exam_type: str


# ─────────────────────────────────────────────────────────────────────────────
# Auth (Phase 3)
# ─────────────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=30)
    email: EmailStr
    password: str = Field(min_length=8)

    @field_validator("username")
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Username may only contain letters, numbers, _ and -")
        return v.lower()


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str
    is_admin: bool


class UserPublic(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: datetime


# ─────────────────────────────────────────────────────────────────────────────
# Sessions (Phase 3)
# ─────────────────────────────────────────────────────────────────────────────

class SessionStartRequest(BaseModel):
    exam_type: str = Field(default="IELTS", examples=["IELTS"])
    count: int = Field(default=10, ge=1, le=20)
    difficulty: Literal["easy", "medium", "hard"] = "medium"
    weak_topics: list[str] = Field(default_factory=list)
    topic_hint: str = ""
    time_limit_minutes: int = Field(default=20, ge=5, le=180)


class SessionStartResponse(BaseModel):
    session_id: int
    exam_type: str
    questions: list[QuestionPublic]
    time_limit_minutes: int
    started_at: datetime


class SubmitRequest(BaseModel):
    """Client sends {question_hash: chosen_option} for every answered question."""
    answers: dict[str, Literal["A", "B", "C", "D"]]


class SessionResult(BaseModel):
    session_id: int
    exam_type: str
    score_pct: float
    correct_count: int
    total_count: int
    started_at: datetime
    finished_at: datetime
    questions: list[QuestionResult]
    weak_topics_updated: list[str]


class SessionSummary(BaseModel):
    session_id: int
    exam_type: str
    score_pct: float | None
    total_q: int
    started_at: datetime
    finished_at: datetime | None


# ─────────────────────────────────────────────────────────────────────────────
# Users (Phase 3)
# ─────────────────────────────────────────────────────────────────────────────

class WeakTopic(BaseModel):
    topic: str
    miss_count: int
    updated_at: datetime


class QuestionHistoryItem(BaseModel):
    question_md5: str
    topic: str | None
    difficulty: str | None
    was_correct: bool | None
    answered_at: datetime
    session_id: int | None


class UserProfile(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    total_sessions: int
    completed_sessions: int
    avg_score: float | None
    top_weak_topics: list[WeakTopic]


# ─────────────────────────────────────────────────────────────────────────────
# Health
# ─────────────────────────────────────────────────────────────────────────────

class ServiceStatus(BaseModel):
    database: str
    ollama: str
    chroma: str
    status: str
