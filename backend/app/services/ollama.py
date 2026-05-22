"""
Ollama HTTP client — async wrapper around the local Ollama REST API.

Ollama must be running natively on the host (not Docker).
Default endpoint: http://localhost:11434

Key methods:
    generate_json()   — send a prompt, parse the response as JSON
    list_models()     — return available local model names
    is_available()    — lightweight ping
"""
from __future__ import annotations

import json
import logging
import re
from typing import Any

import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)

# How long to wait for the LLM to finish generating (seconds).
# A 5-question batch on a mid-range CPU typically takes 15-60s.
GENERATION_TIMEOUT = 600.0


def _extract_json(raw: str) -> dict[str, Any]:
    """
    Parse JSON from the LLM response.

    LLMs sometimes wrap their output in markdown fences (```json ... ```).
    This function strips fences before parsing.
    """
    # Strip markdown fences if present
    fenced = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", raw)
    text = fenced.group(1) if fenced else raw.strip()

    # Find the first {...} block in case of leading/trailing text
    brace_match = re.search(r"\{[\s\S]+\}", text)
    if brace_match:
        text = brace_match.group(0)

    return json.loads(text)


async def generate_json(
    prompt: str,
    model: str | None = None,
    system: str | None = None,
) -> dict[str, Any]:
    """
    Send a prompt to Ollama and return the parsed JSON response.

    Args:
        prompt:  The user-facing generation prompt.
        model:   Ollama model name; defaults to settings.ollama_llm_model.
        system:  Optional system message prepended to the conversation.

    Raises:
        httpx.HTTPError: If Ollama is unreachable or returns a non-2xx status.
        json.JSONDecodeError: If the model returns invalid JSON despite instructions.
    """
    settings = get_settings()
    model = model or settings.ollama_llm_model

    payload: dict[str, Any] = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json",
        "options": {
            "temperature": 0.7,
            "top_p": 0.9,
            "num_predict": 1200,
        },
    }
    if system:
        payload["system"] = system

    url = f"{settings.ollama_base_url}/api/generate"
    logger.info("Calling Ollama model '%s' at %s …", model, url)

    async with httpx.AsyncClient(timeout=GENERATION_TIMEOUT) as client:
        response = await client.post(url, json=payload)
        response.raise_for_status()

    data = response.json()
    raw_text: str = data.get("response", "")
    logger.debug("Ollama raw response (%d chars): %s…", len(raw_text), raw_text[:200])

    return _extract_json(raw_text)


async def list_models() -> list[str]:
    """Return the names of models currently available in the local Ollama instance."""
    settings = get_settings()
    async with httpx.AsyncClient(timeout=5.0) as client:
        resp = await client.get(f"{settings.ollama_base_url}/api/tags")
        resp.raise_for_status()
    models = resp.json().get("models", [])
    return [m["name"] for m in models]


async def is_available() -> bool:
    """Return True if Ollama is reachable."""
    settings = get_settings()
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(f"{settings.ollama_base_url}/api/tags")
            return resp.status_code == 200
    except Exception:
        return False
