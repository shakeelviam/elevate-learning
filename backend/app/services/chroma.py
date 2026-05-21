"""
ChromaDB service — persistent client + semantic retrieval.

The client and collection are module-level singletons initialised once
at startup. All retrieval happens through `query_context()`.
"""
from __future__ import annotations

import logging
from typing import Any

import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

from app.config import get_settings

logger = logging.getLogger(__name__)

_client: chromadb.PersistentClient | None = None
_collection: chromadb.Collection | None = None


def init_chroma() -> None:
    """Create the persistent ChromaDB client and open (or create) the collection."""
    global _client, _collection
    settings = get_settings()

    logger.info("Opening ChromaDB at: %s", settings.chroma_db_path)
    _client = chromadb.PersistentClient(path=settings.chroma_db_path)

    embed_fn = SentenceTransformerEmbeddingFunction(
        model_name=settings.embed_model_name
    )
    _collection = _client.get_or_create_collection(
        name=settings.chroma_collection_name,
        embedding_function=embed_fn,
        metadata={"hnsw:space": "cosine"},
    )
    logger.info(
        "ChromaDB ready — collection '%s' has %d chunks.",
        settings.chroma_collection_name,
        _collection.count(),
    )


def get_collection() -> chromadb.Collection:
    if _collection is None:
        raise RuntimeError("ChromaDB not initialised — call init_chroma() first.")
    return _collection


def query_context(
    query_text: str,
    exam_type: str,
    n_results: int = 6,
) -> list[dict[str, Any]]:
    """
    Retrieve the top-n semantically similar chunks for a given query.

    Applies a metadata filter on `exam_type` when the collection contains
    data for that exam; falls back to an unfiltered query if no results are
    returned (e.g. collection is freshly seeded without that tag yet).

    Returns a list of dicts: {text, source, exam_type, difficulty, chunk_index}
    """
    collection = get_collection()
    if collection.count() == 0:
        logger.warning("ChromaDB collection is empty — no context available.")
        return []

    def _query(where: dict | None) -> list[dict[str, Any]]:
        kwargs: dict[str, Any] = {
            "query_texts": [query_text],
            "n_results": min(n_results, collection.count()),
            "include": ["documents", "metadatas", "distances"],
        }
        if where:
            kwargs["where"] = where
        results = collection.query(**kwargs)
        chunks: list[dict[str, Any]] = []
        docs = results.get("documents", [[]])[0]
        metas = results.get("metadatas", [[]])[0]
        dists = results.get("distances", [[]])[0]
        for doc, meta, dist in zip(docs, metas, dists):
            chunks.append({
                "text": doc,
                "source": meta.get("source", "unknown"),
                "exam_type": meta.get("exam_type", ""),
                "difficulty": meta.get("difficulty", "medium"),
                "chunk_index": meta.get("chunk_index", 0),
                "similarity": round(1.0 - dist, 4),
            })
        return chunks

    # Try filtered first, fall back to unfiltered
    chunks = _query({"exam_type": exam_type.upper()})
    if not chunks:
        logger.warning(
            "No chunks found for exam_type='%s' — retrying without filter.", exam_type
        )
        chunks = _query(None)

    return chunks


def collection_stats() -> dict[str, Any]:
    """Return basic stats about the collection (used by /health)."""
    try:
        col = get_collection()
        return {"count": col.count(), "name": col.name, "status": "ok"}
    except Exception as exc:
        return {"count": 0, "name": "", "status": f"error: {exc}"}
