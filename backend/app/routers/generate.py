"""
POST /generate — Test question generation endpoint.

Accepts a GenerateRequest, runs the full RAG pipeline, and returns
a list of deduplicated MCQ questions with explanations.
"""
import logging

from fastapi import APIRouter, HTTPException, status

from app.schemas import GenerateRequest, GenerateResponse
from app.services import question_gen
from app.services import ollama as ollama_svc

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/generate", tags=["generation"])


@router.post(
    "",
    response_model=GenerateResponse,
    summary="Generate adaptive practice questions",
    description=(
        "Runs the full RAG pipeline: retrieves relevant context from ChromaDB, "
        "calls the local Ollama LLM with a structured prompt, and returns "
        "validated, deduplicated MCQ questions with explanations."
    ),
)
async def generate(request: GenerateRequest) -> GenerateResponse:
    # Guard: ensure Ollama is reachable before running the full pipeline
    if not await ollama_svc.is_available():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Ollama is not reachable at the configured URL. "
                "Make sure the Ollama app is running locally."
            ),
        )

    try:
        result = await question_gen.generate_questions(request)
    except Exception as exc:
        logger.exception("Question generation failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Generation failed: {exc}",
        ) from exc

    if not result.questions:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=(
                "The LLM did not return any valid questions. "
                "Try a different exam type or topic hint, or check the Ollama model."
            ),
        )

    return result


@router.get(
    "/models",
    summary="List available Ollama models",
    description="Returns the names of all models currently loaded in the local Ollama instance.",
)
async def list_models() -> dict:
    try:
        models = await ollama_svc.list_models()
        return {"models": models}
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Could not reach Ollama: {exc}",
        ) from exc
