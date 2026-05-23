"""
Admin routes — PDF upload, collection management, user administration.

All routes require a valid JWT from a user with is_admin=True.
The get_current_admin dependency raises 403 for non-admins.
"""
from __future__ import annotations

import logging
import tempfile
from pathlib import Path
from typing import Any

from datetime import datetime
from typing import Literal

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from pydantic import BaseModel

from app.auth import get_current_admin
from app.database import get_conn
from app.services.chroma import get_collection, collection_stats
from app.services.ingestion import ingest_pdf_async, get_collection_breakdown

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["admin"])


# ── Response models ───────────────────────────────────────────────────────────

class UploadResponse(BaseModel):
    filename: str
    chunks_added: int
    total_in_collection: int
    exam_type: str
    difficulty: str


class CollectionStatsResponse(BaseModel):
    collection_name: str
    total_chunks: int
    breakdown: dict[str, int]


class AdminUserItem(BaseModel):
    id: int
    username: str
    email: str
    is_admin: bool
    created_at: Any
    session_count: int


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload a PDF and run the ingestion pipeline",
    description=(
        "Saves the uploaded PDF to a temp file, extracts text, chunks it, "
        "generates embeddings, and upserts into ChromaDB. "
        "Admin-only."
    ),
)
async def upload_pdf(
    file: UploadFile = File(..., description="PDF file to ingest"),
    exam_type: str = Form(default="GENERAL", description="Exam tag (IELTS, TOEFL, …)"),
    difficulty: str = Form(default="medium", description="easy | medium | hard"),
    chunk_size: int = Form(default=600, ge=200, le=2000),
    chunk_overlap: int = Form(default=80, ge=0, le=400),
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> UploadResponse:
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are accepted.",
        )

    if difficulty not in ("easy", "medium", "hard"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="difficulty must be 'easy', 'medium', or 'hard'.",
        )

    # Write upload to a named temp file
    suffix = f"_{Path(file.filename).stem}.pdf"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp_path = Path(tmp.name)
        content = await file.read()
        tmp.write(content)

    try:
        chunks_added = await ingest_pdf_async(
            pdf_path=tmp_path,
            exam_type=exam_type,
            difficulty=difficulty,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
        )
    finally:
        tmp_path.unlink(missing_ok=True)

    if chunks_added == 0:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No text could be extracted from this PDF. Make sure it is not a scanned image.",
        )

    total = get_collection().count()
    logger.info(
        "Admin upload: %s → %d chunks (exam=%s). Collection total: %d",
        file.filename, chunks_added, exam_type, total,
    )
    return UploadResponse(
        filename=file.filename,
        chunks_added=chunks_added,
        total_in_collection=total,
        exam_type=exam_type.upper(),
        difficulty=difficulty,
    )


@router.get(
    "/collection",
    response_model=CollectionStatsResponse,
    summary="ChromaDB collection statistics",
)
async def get_collection_info(
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> CollectionStatsResponse:
    stats = collection_stats()
    breakdown = get_collection_breakdown()
    return CollectionStatsResponse(
        collection_name=stats.get("name", ""),
        total_chunks=stats.get("count", 0),
        breakdown=breakdown,
    )


@router.delete(
    "/collection/reset",
    summary="Delete all chunks from the ChromaDB collection",
    description="Irreversible. Deletes every chunk. Admin-only.",
)
async def reset_collection(
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> dict[str, str]:
    from app.config import get_settings
    import chromadb
    from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
    from app.services import chroma as chroma_svc

    settings = get_settings()
    client = chromadb.PersistentClient(path=settings.chroma_db_path)
    client.delete_collection(settings.chroma_collection_name)

    # Re-create empty collection and update singleton
    embed_fn = SentenceTransformerEmbeddingFunction(model_name=settings.embed_model_name)
    new_col = client.get_or_create_collection(
        name=settings.chroma_collection_name,
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"},
    )
    chroma_svc._collection = new_col
    logger.warning("Admin reset ChromaDB collection '%s'.", settings.chroma_collection_name)
    return {"message": f"Collection '{settings.chroma_collection_name}' cleared."}


@router.get(
    "/users",
    response_model=list[AdminUserItem],
    summary="List all registered users",
)
async def list_users(
    _admin: dict[str, Any] = Depends(get_current_admin),
    limit: int = 100,
    offset: int = 0,
) -> list[AdminUserItem]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT
                    u.id,
                    u.username,
                    u.email,
                    u.is_admin,
                    u.created_at,
                    COUNT(s.id) AS session_count
                FROM users u
                LEFT JOIN sessions s ON s.user_id = u.id
                GROUP BY u.id
                ORDER BY u.created_at DESC
                LIMIT %s OFFSET %s
                """,
                (limit, offset),
            )
            rows = cur.fetchall()

    return [
        AdminUserItem(
            id=r[0],
            username=r[1],
            email=r[2],
            is_admin=r[3],
            created_at=r[4],
            session_count=r[5],
        )
        for r in rows
    ]


@router.patch(
    "/users/{user_id}/make-admin",
    summary="Grant or revoke admin privileges for a user",
)
async def set_admin_status(
    user_id: int,
    is_admin: bool,
    current_admin: dict[str, Any] = Depends(get_current_admin),
) -> dict[str, Any]:
    if user_id == current_admin["user_id"] and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot revoke your own admin privileges.",
        )
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE users SET is_admin = %s WHERE id = %s RETURNING username",
                (is_admin, user_id),
            )
            row = cur.fetchone()
    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    logger.info(
        "Admin %s set is_admin=%s for user '%s' (id=%d)",
        current_admin["username"], is_admin, row[0], user_id,
    )
    return {"user_id": user_id, "username": row[0], "is_admin": is_admin}


# ── Question Banks ─────────────────────────────────────────────────────────────

class BankQuestionCreate(BaseModel):
    question_type: Literal["mcq", "tfng", "passage_mcq"] = "mcq"
    passage: str | None = None
    passage_title: str | None = None
    question: str
    option_a: str | None = None
    option_b: str | None = None
    option_c: str | None = None
    option_d: str | None = None
    correct: str  # A | B | C | D | True | False | Not Given
    explanation: str = ""
    topic: str = ""
    difficulty: Literal["easy", "medium", "hard"] = "medium"
    position: int = 0


class BankQuestionPublic(BankQuestionCreate):
    id: int
    bank_id: int
    created_at: datetime


class QuestionBankCreate(BaseModel):
    name: str
    exam_type: str
    section: str | None = None
    description: str | None = None


class QuestionBankPublic(QuestionBankCreate):
    id: int
    question_count: int = 0
    created_at: datetime


class QuestionBankDetail(QuestionBankPublic):
    questions: list[BankQuestionPublic]


def _row_to_question(q: tuple) -> BankQuestionPublic:
    return BankQuestionPublic(
        id=q[0], bank_id=q[1], question_type=q[2], passage=q[3], passage_title=q[4],
        question=q[5], option_a=q[6], option_b=q[7], option_c=q[8], option_d=q[9],
        correct=q[10], explanation=q[11], topic=q[12], difficulty=q[13],
        position=q[14], created_at=q[15],
    )


_Q_SELECT = """
    SELECT id, bank_id, question_type, passage, passage_title, question,
           option_a, option_b, option_c, option_d, correct, explanation,
           topic, difficulty, position, created_at
    FROM bank_questions
"""


@router.get("/banks", response_model=list[QuestionBankPublic], summary="List all question banks")
async def list_banks(_admin: dict[str, Any] = Depends(get_current_admin)) -> list[QuestionBankPublic]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT qb.id, qb.name, qb.exam_type, qb.section, qb.description,
                       qb.created_at, COUNT(bq.id) AS question_count
                FROM question_banks qb
                LEFT JOIN bank_questions bq ON bq.bank_id = qb.id
                GROUP BY qb.id
                ORDER BY qb.exam_type, qb.name
            """)
            rows = cur.fetchall()
    return [
        QuestionBankPublic(id=r[0], name=r[1], exam_type=r[2], section=r[3],
                           description=r[4], created_at=r[5], question_count=r[6])
        for r in rows
    ]


@router.post("/banks", response_model=QuestionBankPublic, status_code=201,
             summary="Create a new question bank")
async def create_bank(
    body: QuestionBankCreate,
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> QuestionBankPublic:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO question_banks (name, exam_type, section, description) "
                "VALUES (%s,%s,%s,%s) RETURNING id, created_at",
                (body.name, body.exam_type, body.section, body.description),
            )
            row = cur.fetchone()
    return QuestionBankPublic(id=row[0], name=body.name, exam_type=body.exam_type,
                              section=body.section, description=body.description,
                              created_at=row[1], question_count=0)


@router.get("/banks/{bank_id}", response_model=QuestionBankDetail,
            summary="Get a bank with all its questions")
async def get_bank(
    bank_id: int,
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> QuestionBankDetail:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, name, exam_type, section, description, created_at "
                "FROM question_banks WHERE id=%s", (bank_id,)
            )
            b = cur.fetchone()
            if not b:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Bank not found")
            cur.execute(_Q_SELECT + "WHERE bank_id=%s ORDER BY position, id", (bank_id,))
            qs = [_row_to_question(q) for q in cur.fetchall()]
    return QuestionBankDetail(id=b[0], name=b[1], exam_type=b[2], section=b[3],
                              description=b[4], created_at=b[5],
                              question_count=len(qs), questions=qs)


@router.patch("/banks/{bank_id}", response_model=QuestionBankPublic,
              summary="Update bank metadata")
async def update_bank(
    bank_id: int,
    body: QuestionBankCreate,
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> QuestionBankPublic:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE question_banks SET name=%s, exam_type=%s, section=%s, description=%s "
                "WHERE id=%s RETURNING created_at",
                (body.name, body.exam_type, body.section, body.description, bank_id),
            )
            row = cur.fetchone()
            if not row:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Bank not found")
            cur.execute("SELECT COUNT(*) FROM bank_questions WHERE bank_id=%s", (bank_id,))
            count = cur.fetchone()[0]
    return QuestionBankPublic(id=bank_id, name=body.name, exam_type=body.exam_type,
                              section=body.section, description=body.description,
                              created_at=row[0], question_count=count)


@router.delete("/banks/{bank_id}", summary="Delete a bank and all its questions")
async def delete_bank(
    bank_id: int,
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> dict[str, str]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM question_banks WHERE id=%s RETURNING id", (bank_id,))
            if not cur.fetchone():
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Bank not found")
    return {"deleted": str(bank_id)}


@router.post("/banks/{bank_id}/questions", response_model=BankQuestionPublic, status_code=201,
             summary="Add a question to a bank")
async def add_question(
    bank_id: int,
    body: BankQuestionCreate,
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> BankQuestionPublic:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM question_banks WHERE id=%s", (bank_id,))
            if not cur.fetchone():
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Bank not found")
            cur.execute("""
                INSERT INTO bank_questions
                    (bank_id, question_type, passage, passage_title, question,
                     option_a, option_b, option_c, option_d, correct,
                     explanation, topic, difficulty, position)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                RETURNING id, created_at
            """, (bank_id, body.question_type, body.passage, body.passage_title,
                  body.question, body.option_a, body.option_b, body.option_c,
                  body.option_d, body.correct, body.explanation, body.topic,
                  body.difficulty, body.position))
            row = cur.fetchone()
    return BankQuestionPublic(id=row[0], bank_id=bank_id, created_at=row[1], **body.model_dump())


@router.patch("/questions/{question_id}", response_model=BankQuestionPublic,
              summary="Update a question")
async def update_question(
    question_id: int,
    body: BankQuestionCreate,
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> BankQuestionPublic:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE bank_questions
                SET question_type=%s, passage=%s, passage_title=%s, question=%s,
                    option_a=%s, option_b=%s, option_c=%s, option_d=%s, correct=%s,
                    explanation=%s, topic=%s, difficulty=%s, position=%s
                WHERE id=%s RETURNING bank_id, created_at
            """, (body.question_type, body.passage, body.passage_title, body.question,
                  body.option_a, body.option_b, body.option_c, body.option_d, body.correct,
                  body.explanation, body.topic, body.difficulty, body.position, question_id))
            row = cur.fetchone()
            if not row:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Question not found")
    return BankQuestionPublic(id=question_id, bank_id=row[0], created_at=row[1], **body.model_dump())


@router.delete("/questions/{question_id}", summary="Delete a question")
async def delete_question(
    question_id: int,
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> dict[str, str]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM bank_questions WHERE id=%s RETURNING id", (question_id,))
            if not cur.fetchone():
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Question not found")
    return {"deleted": str(question_id)}


@router.post("/banks/{bank_id}/questions/bulk", summary="Bulk-add questions from a JSON array")
async def bulk_add_questions(
    bank_id: int,
    questions: list[BankQuestionCreate],
    _admin: dict[str, Any] = Depends(get_current_admin),
) -> dict[str, int]:
    if not questions:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Question list is empty")
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1 FROM question_banks WHERE id=%s", (bank_id,))
            if not cur.fetchone():
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Bank not found")
            for q in questions:
                cur.execute("""
                    INSERT INTO bank_questions
                        (bank_id, question_type, passage, passage_title, question,
                         option_a, option_b, option_c, option_d, correct,
                         explanation, topic, difficulty, position)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                """, (bank_id, q.question_type, q.passage, q.passage_title,
                      q.question, q.option_a, q.option_b, q.option_c,
                      q.option_d, q.correct, q.explanation, q.topic,
                      q.difficulty, q.position))
    return {"added": len(questions)}
