"""
Ingestion service — PDF → chunks → ChromaDB embeddings.

This module contains the core logic shared between:
  - scripts/ingest_pdf.py  (CLI)
  - app/routers/admin.py   (FastAPI upload route)

The async wrapper runs the CPU-bound work in a thread pool
so it never blocks the event loop.
"""
from __future__ import annotations

import asyncio
import hashlib
import logging
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Any

import fitz  # PyMuPDF

from app.services.chroma import get_collection

logger = logging.getLogger(__name__)

DEFAULT_CHUNK_SIZE = 600
DEFAULT_CHUNK_OVERLAP = 80

_executor = ThreadPoolExecutor(max_workers=2)


# ── Text extraction ────────────────────────────────────────────────────────────

def extract_text(pdf_path: Path) -> str:
    doc = fitz.open(str(pdf_path))
    pages: list[str] = []
    for page_num, page in enumerate(doc, start=1):
        text = page.get_text("text").strip()
        if text:
            pages.append(f"[Page {page_num}]\n{text}")
    doc.close()
    return "\n\n".join(pages)


# ── Chunking ──────────────────────────────────────────────────────────────────

def chunk_text(
    text: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> list[str]:
    chunks: list[str] = []
    start = 0
    while start < len(text):
        end = min(start + chunk_size, len(text))
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


def chunk_id(source: str, index: int, text: str) -> str:
    content_hash = hashlib.md5(text.encode()).hexdigest()[:8]
    return f"{Path(source).stem}_{index:05d}_{content_hash}"


# ── Core sync ingest ──────────────────────────────────────────────────────────

def ingest_pdf_sync(
    pdf_path: Path,
    exam_type: str,
    difficulty: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> int:
    """
    Parse, chunk, embed, and upsert a single PDF into ChromaDB.
    Returns the number of chunks upserted.

    Uses the shared ChromaDB collection singleton (same embedding model
    as the query path in chroma.py, ensuring vector space consistency).
    """
    logger.info("Ingesting: %s (exam=%s, difficulty=%s)", pdf_path.name, exam_type, difficulty)
    text = extract_text(pdf_path)
    if not text.strip():
        logger.warning("No text extracted from %s — skipping.", pdf_path)
        return 0

    chunks = chunk_text(text, chunk_size=chunk_size, overlap=chunk_overlap)
    if not chunks:
        return 0

    collection = get_collection()

    ids: list[str] = []
    docs: list[str] = []
    metas: list[dict[str, Any]] = []

    for i, chunk in enumerate(chunks):
        cid = chunk_id(str(pdf_path), i, chunk)
        ids.append(cid)
        docs.append(chunk)
        metas.append({
            "source": pdf_path.name,
            "chunk_index": i,
            "exam_type": exam_type.upper(),
            "difficulty": difficulty,
        })

    collection.upsert(ids=ids, documents=docs, metadatas=metas)
    logger.info("Upserted %d chunks from %s.", len(chunks), pdf_path.name)
    return len(chunks)


# ── Async wrapper ─────────────────────────────────────────────────────────────

async def ingest_pdf_async(
    pdf_path: Path,
    exam_type: str,
    difficulty: str,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
    chunk_overlap: int = DEFAULT_CHUNK_OVERLAP,
) -> int:
    """Non-blocking wrapper — runs ingest_pdf_sync in a thread pool."""
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(
        _executor,
        ingest_pdf_sync,
        pdf_path,
        exam_type,
        difficulty,
        chunk_size,
        chunk_overlap,
    )


# ── Collection stats ──────────────────────────────────────────────────────────

def get_collection_breakdown() -> dict[str, int]:
    """
    Returns a dict of {exam_type: chunk_count}.
    Loads all metadata (no embeddings/documents) and groups in Python.
    Suitable for collections up to ~500k chunks.
    """
    collection = get_collection()
    total = collection.count()
    if total == 0:
        return {}

    result = collection.get(include=["metadatas"])
    breakdown: dict[str, int] = {}
    for meta in result.get("metadatas") or []:
        et = (meta or {}).get("exam_type", "UNKNOWN")
        breakdown[et] = breakdown.get(et, 0) + 1
    return breakdown
