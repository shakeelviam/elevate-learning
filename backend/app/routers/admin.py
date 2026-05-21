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
