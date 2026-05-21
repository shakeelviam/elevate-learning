"""
CLI smoke test for the Phase 2 generation pipeline.

Runs the full RAG pipeline (ChromaDB → Ollama → parse) without starting
the FastAPI server. Useful for verifying your local Ollama + ChromaDB setup.

Usage (from /backend, with venv activated):
    python -m scripts.test_generation
    python -m scripts.test_generation --exam-type TOEFL --count 3 --difficulty easy
    python -m scripts.test_generation --topic "reading comprehension" --weak "vocabulary,inference"
    python -m scripts.test_generation --no-rag   # bypass ChromaDB, pure LLM
"""
from __future__ import annotations

import argparse
import asyncio
import json
import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from dotenv import load_dotenv
load_dotenv()

from app.config import get_settings
from app.schemas import GenerateRequest
from app.services.chroma import init_chroma, collection_stats
from app.services.ollama import is_available, list_models
from app.services.question_gen import generate_questions

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
)
logger = logging.getLogger(__name__)


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Smoke-test the Elevate AI question generation pipeline.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    p.add_argument("--exam-type", default="IELTS")
    p.add_argument("--count", type=int, default=3)
    p.add_argument("--difficulty", default="medium", choices=["easy", "medium", "hard"])
    p.add_argument("--topic", default="", help="Optional topic hint.")
    p.add_argument(
        "--weak",
        default="",
        help="Comma-separated weak topics, e.g. 'grammar,vocabulary'.",
    )
    p.add_argument(
        "--no-rag",
        action="store_true",
        help="Skip ChromaDB retrieval and use a fallback prompt (no context).",
    )
    return p.parse_args()


async def run(args: argparse.Namespace) -> None:
    settings = get_settings()
    print("\n" + "=" * 60)
    print("  Elevate AI — Generation Smoke Test")
    print("=" * 60)
    print(f"  Exam type : {args.exam_type}")
    print(f"  Count     : {args.count}")
    print(f"  Difficulty: {args.difficulty}")
    print(f"  Topic hint: {args.topic or '(none)'}")
    print(f"  Weak areas: {args.weak or '(none)'}")
    print(f"  LLM model : {settings.ollama_llm_model}")
    print(f"  Embed model: {settings.embed_model_name}")
    print("=" * 60 + "\n")

    # ── Check Ollama ──────────────────────────────────────────────────────────
    print("[1/4] Checking Ollama availability…")
    if not await is_available():
        print(f"  ERROR: Ollama is not reachable at {settings.ollama_base_url}")
        print("  Make sure the Ollama app is running and try again.")
        sys.exit(1)
    models = await list_models()
    print(f"  OK — Available models: {', '.join(models) or '(none loaded)'}")
    if settings.ollama_llm_model not in " ".join(models):
        print(
            f"  WARNING: Configured model '{settings.ollama_llm_model}' not found in model list.\n"
            f"  Pull it with:  ollama pull {settings.ollama_llm_model}"
        )

    # ── Initialise ChromaDB ───────────────────────────────────────────────────
    if not args.no_rag:
        print("\n[2/4] Initialising ChromaDB…")
        init_chroma()
        stats = collection_stats()
        print(f"  Collection '{stats['name']}' — {stats['count']} chunks stored.")
        if stats["count"] == 0:
            print(
                "  WARNING: Collection is empty. Run the ingest script first:\n"
                "    python -m scripts.ingest_pdf path/to/book.pdf --exam-type IELTS\n"
                "  Falling back to no-RAG mode for this test."
            )
    else:
        print("\n[2/4] Skipping ChromaDB (--no-rag flag set).")

    # ── Build request ─────────────────────────────────────────────────────────
    print("\n[3/4] Sending generation request to Ollama…")
    weak_topics = [t.strip() for t in args.weak.split(",") if t.strip()]
    req = GenerateRequest(
        exam_type=args.exam_type,
        count=args.count,
        difficulty=args.difficulty,
        weak_topics=weak_topics,
        topic_hint=args.topic,
        seen_hashes=[],
    )

    response = await generate_questions(req)

    # ── Print results ─────────────────────────────────────────────────────────
    print(f"\n[4/4] Results — {len(response.questions)} question(s) generated:")
    print(f"      Context chunks used: {response.context_chunks_used}")
    print(f"      Model: {response.model_used}\n")

    for i, q in enumerate(response.questions, start=1):
        print(f"  ── Question {i} [{q.difficulty}] — {q.topic} ──")
        print(f"  {q.question}\n")
        for label, text in q.options.model_dump().items():
            marker = " ✓" if label == q.correct else "  "
            print(f"  {marker}  {label}) {text}")
        print(f"\n  Explanation: {q.explanation}")
        print(f"  Hash: {q.hash[:12]}…")
        print()

    print("=" * 60)
    print(f"  Smoke test PASSED — {len(response.questions)} valid questions generated.")
    print("=" * 60 + "\n")


def main() -> None:
    asyncio.run(run(parse_args()))


if __name__ == "__main__":
    main()
