"""
PDF Ingestion CLI — Phase 1
────────────────────────────
Thin CLI wrapper around app.services.ingestion.
All core logic lives in the service so it can be shared with the admin upload route.

Usage:
    python -m scripts.ingest_pdf path/to/book.pdf [more.pdf ...] \\
        --exam-type IELTS \\
        --difficulty medium \\
        --chunk-size 600 \\
        --chunk-overlap 80
"""
from __future__ import annotations

import argparse
import logging
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction
from dotenv import load_dotenv

load_dotenv()

# Bootstrap the ChromaDB singleton before importing the service
from app.config import get_settings
from app.services import chroma as chroma_svc
from app.services.ingestion import (
    DEFAULT_CHUNK_OVERLAP,
    DEFAULT_CHUNK_SIZE,
    ingest_pdf_sync,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
logger = logging.getLogger(__name__)


def _bootstrap_chroma() -> None:
    """Initialise the ChromaDB singleton for standalone CLI use."""
    settings = get_settings()
    client = chromadb.PersistentClient(path=settings.chroma_db_path)
    embed_fn = SentenceTransformerEmbeddingFunction(model_name=settings.embed_model_name)
    collection = client.get_or_create_collection(
        name=settings.chroma_collection_name,
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"},
    )
    chroma_svc._client = client
    chroma_svc._collection = collection
    logger.info(
        "ChromaDB ready — collection '%s' has %d existing chunks.",
        settings.chroma_collection_name,
        collection.count(),
    )


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Ingest PDF study materials into ChromaDB for RAG-based question generation.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    p.add_argument("pdfs", nargs="+", type=Path, help="One or more PDF file paths.")
    p.add_argument("--exam-type", default="GENERAL",
                   help="Tag for the exam type (e.g. IELTS, TOEFL, GMAT).")
    p.add_argument("--difficulty", default="medium",
                   choices=["easy", "medium", "hard"])
    p.add_argument("--chunk-size", type=int, default=DEFAULT_CHUNK_SIZE)
    p.add_argument("--chunk-overlap", type=int, default=DEFAULT_CHUNK_OVERLAP)
    return p.parse_args()


def main() -> None:
    args = parse_args()

    for pdf in args.pdfs:
        if not pdf.exists():
            logger.error("File not found: %s", pdf)
            sys.exit(1)

    _bootstrap_chroma()

    total = 0
    for pdf_path in args.pdfs:
        n = ingest_pdf_sync(
            pdf_path=pdf_path,
            exam_type=args.exam_type.upper(),
            difficulty=args.difficulty,
            chunk_size=args.chunk_size,
            chunk_overlap=args.chunk_overlap,
        )
        total += n

    from app.services.chroma import get_collection
    logger.info("Done. Chunks upserted this run: %d. Collection total: %d",
                total, get_collection().count())


if __name__ == "__main__":
    main()
