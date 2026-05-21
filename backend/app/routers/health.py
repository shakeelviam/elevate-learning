from fastapi import APIRouter
from pydantic import BaseModel

from app.database import get_conn
from app.services.ollama import is_available as ollama_available
from app.services.chroma import collection_stats

router = APIRouter(prefix="/health", tags=["health"])


class HealthResponse(BaseModel):
    status: str
    database: str
    ollama: str
    chroma: str
    chroma_chunks: int


@router.get("", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    # ── Database ──────────────────────────────────────────────────────────────
    db_status = "ok"
    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
    except Exception as exc:
        db_status = f"error: {exc}"

    # ── Ollama ────────────────────────────────────────────────────────────────
    ollama_status = "ok" if await ollama_available() else "error: unreachable"

    # ── ChromaDB ──────────────────────────────────────────────────────────────
    stats = collection_stats()
    chroma_status = stats["status"]
    chroma_chunks = stats["count"]

    overall = "ok" if all(
        s == "ok" for s in [db_status, ollama_status, chroma_status]
    ) else "degraded"

    return HealthResponse(
        status=overall,
        database=db_status,
        ollama=ollama_status,
        chroma=chroma_status,
        chroma_chunks=chroma_chunks,
    )
