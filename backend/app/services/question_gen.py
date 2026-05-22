"""
Question Generation Engine — Phase 2 core

Full RAG pipeline:
  1. Build a semantic query from the exam type, topic hint, and weak areas.
  2. Retrieve the most relevant context chunks from ChromaDB.
  3. Assemble a structured prompt that mandates original (non-copied) questions.
  4. Call the local Ollama LLM and parse the JSON response.
  5. Validate each question, compute its deduplication hash, and filter out
     any questions whose hash appears in the seen_hashes list.
  6. Return a typed list of Question objects.
"""
from __future__ import annotations

import hashlib
import json
import logging
from typing import Any

from app.schemas import GenerateRequest, GenerateResponse, Question, QuestionOptions
from app.services import chroma as chroma_svc
from app.services import ollama as ollama_svc
from app.config import get_settings

logger = logging.getLogger(__name__)


# ── Prompt templates ──────────────────────────────────────────────────────────

SYSTEM_PROMPT = """\
You are a world-class exam preparation tutor specialising in internationally recognised \
language and aptitude tests. You create high-quality, original practice questions that \
help students build genuine understanding — never superficial test-taking tricks.\
"""

GENERATION_PROMPT_TEMPLATE = """\
## Task
Generate {count} original multiple-choice practice questions for a student preparing for {exam_type}.

## Student Profile
- Weak areas that need extra focus: {weak_topics}
- Difficulty level requested: {difficulty}

## Source Context
The following excerpts are from authentic study materials. Use them as INSPIRATION only.
Do NOT copy sentences verbatim — rephrase and reframe ideas into completely new questions.
This is essential for copyright compliance and for testing deeper understanding.

---
{context}
---

## Output Requirements
Respond with ONLY a valid JSON object. No markdown, no explanation outside the JSON.
Use this exact schema:

{{
  "questions": [
    {{
      "question": "<full question text>",
      "options": {{
        "A": "<option text>",
        "B": "<option text>",
        "C": "<option text>",
        "D": "<option text>"
      }},
      "correct": "<A|B|C|D>",
      "explanation": "<why the correct answer is right, and why the others are wrong>",
      "topic": "<2-4 word topic label>",
      "difficulty": "<easy|medium|hard>"
    }}
  ]
}}

Rules:
- Every question must have exactly 4 options.
- Only ONE option must be correct.
- The explanation must be detailed (2-4 sentences).
- Do not number the options inside the option text.
- Generate exactly {count} questions — no more, no fewer.
"""

FALLBACK_PROMPT_TEMPLATE = """\
## Task
Generate {count} original multiple-choice practice questions for a student preparing \
for {exam_type} at {difficulty} difficulty level.

Focus on these topic areas: {weak_topics}

## Output Requirements
Respond with ONLY a valid JSON object using this exact schema:

{{
  "questions": [
    {{
      "question": "<full question text>",
      "options": {{
        "A": "<option text>",
        "B": "<option text>",
        "C": "<option text>",
        "D": "<option text>"
      }},
      "correct": "<A|B|C|D>",
      "explanation": "<why the correct answer is right>",
      "topic": "<2-4 word topic label>",
      "difficulty": "<easy|medium|hard>"
    }}
  ]
}}

Generate exactly {count} questions.
"""


# ── Helpers ───────────────────────────────────────────────────────────────────

def _question_hash(question_text: str) -> str:
    """Stable MD5 hash of lowercased, whitespace-normalised question text."""
    normalised = " ".join(question_text.lower().split())
    return hashlib.md5(normalised.encode()).hexdigest()


def _build_context_block(chunks: list[dict[str, Any]], max_chars: int = 1500) -> str:
    """Concatenate retrieved chunks into a readable context block, capped to keep prompts short."""
    parts: list[str] = []
    total = 0
    for i, chunk in enumerate(chunks, start=1):
        text = chunk["text"][:600]  # cap each chunk
        entry = f"[Excerpt {i}]\n{text}"
        total += len(entry)
        if total > max_chars:
            break
        parts.append(entry)
    return "\n\n".join(parts)


def _parse_questions(
    raw: dict[str, Any],
    seen_hashes: set[str],
) -> list[Question]:
    """
    Validate and deserialise the LLM JSON output into Question objects.
    Skips malformed entries and questions already seen (by hash).
    """
    questions: list[Question] = []
    raw_list = raw.get("questions", [])

    if not isinstance(raw_list, list):
        logger.error("LLM returned 'questions' field that is not a list: %r", raw_list)
        return []

    for item in raw_list:
        try:
            opts_raw = item.get("options", {})
            for key in ("A", "B", "C", "D"):
                if key not in opts_raw:
                    raise ValueError(f"Missing option '{key}'")

            correct = str(item.get("correct", "")).strip().upper()
            if correct not in ("A", "B", "C", "D"):
                raise ValueError(f"Invalid correct value: {correct!r}")

            q_text = str(item.get("question", "")).strip()
            if not q_text:
                raise ValueError("Empty question text")

            q_hash = _question_hash(q_text)
            if q_hash in seen_hashes:
                logger.debug("Skipping already-seen question: %s…", q_text[:60])
                continue

            questions.append(Question(
                question=q_text,
                options=QuestionOptions(
                    A=str(opts_raw["A"]).strip(),
                    B=str(opts_raw["B"]).strip(),
                    C=str(opts_raw["C"]).strip(),
                    D=str(opts_raw["D"]).strip(),
                ),
                correct=correct,  # type: ignore[arg-type]
                explanation=str(item.get("explanation", "")).strip(),
                topic=str(item.get("topic", "")).strip(),
                difficulty=item.get("difficulty", "medium"),
                hash=q_hash,
            ))
        except Exception as exc:
            logger.warning("Skipping malformed question item (%s): %r", exc, item)

    return questions


# ── Main generation function ──────────────────────────────────────────────────

async def generate_questions(request: GenerateRequest) -> GenerateResponse:
    """
    Full RAG pipeline: retrieve → prompt → generate → validate → deduplicate.

    Falls back to a context-free prompt if ChromaDB is empty or unreachable.
    """
    settings = get_settings()
    seen_set = set(request.seen_hashes)

    # ── Step 1: Build semantic query ─────────────────────────────────────────
    topic_parts = [request.exam_type]
    if request.topic_hint:
        topic_parts.append(request.topic_hint)
    if request.weak_topics:
        topic_parts.extend(request.weak_topics)
    query_text = " ".join(topic_parts)

    # ── Step 2: Retrieve context ─────────────────────────────────────────────
    chunks = chroma_svc.query_context(
        query_text=query_text,
        exam_type=request.exam_type,
        n_results=8,
    )
    logger.info(
        "Retrieved %d context chunks for exam_type='%s', query='%s'",
        len(chunks), request.exam_type, query_text[:80],
    )

    weak_topics_str = (
        ", ".join(request.weak_topics) if request.weak_topics else "general topics"
    )

    # ── Step 3: Build prompt ─────────────────────────────────────────────────
    if chunks:
        context_block = _build_context_block(chunks)
        prompt = GENERATION_PROMPT_TEMPLATE.format(
            count=request.count,
            exam_type=request.exam_type,
            weak_topics=weak_topics_str,
            difficulty=request.difficulty,
            context=context_block,
        )
    else:
        logger.warning(
            "No context chunks available — using fallback prompt (no RAG)."
        )
        prompt = FALLBACK_PROMPT_TEMPLATE.format(
            count=request.count,
            exam_type=request.exam_type,
            weak_topics=weak_topics_str,
            difficulty=request.difficulty,
        )

    # ── Step 4: Call Ollama ──────────────────────────────────────────────────
    model = settings.ollama_llm_model
    raw_output = await ollama_svc.generate_json(
        prompt=prompt,
        model=model,
        system=SYSTEM_PROMPT,
    )

    # ── Step 5: Parse + deduplicate ──────────────────────────────────────────
    questions = _parse_questions(raw_output, seen_set)

    # If Ollama returned fewer than requested (edge case), log a warning.
    if len(questions) < request.count:
        logger.warning(
            "Requested %d questions but only parsed %d valid ones.",
            request.count, len(questions),
        )

    return GenerateResponse(
        questions=questions,
        context_chunks_used=len(chunks),
        model_used=model,
        exam_type=request.exam_type,
    )
