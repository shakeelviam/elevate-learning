"""
Elevate Learning — FastAPI backend entry point.

Start the dev server:
    uvicorn main:app --reload --port 8000
"""
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import close_pool, init_pool, run_migrations
from app.services.chroma import init_chroma
from app.routers import admin, auth, generate, health, sessions, users

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="Elevate Learning — AI Backend",
    description="Local RAG pipeline for adaptive exam-prep test generation.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
    logger.info("Starting Elevate AI backend…")
    init_pool()
    run_migrations()
    init_chroma()


@app.on_event("shutdown")
async def on_shutdown() -> None:
    close_pool()


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(generate.router)
app.include_router(sessions.router)
app.include_router(users.router)
app.include_router(admin.router)


@app.get("/", tags=["root"])
async def root() -> dict:
    return {"message": "Elevate AI backend is running.", "docs": "/docs"}
