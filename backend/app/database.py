"""
PostgreSQL connection pool using psycopg2.

Usage (in a route):
    from app.database import get_conn
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
"""
import contextlib
import logging
from typing import Generator

import psycopg2
from psycopg2 import pool as pg_pool

from app.config import get_settings

logger = logging.getLogger(__name__)

_pool: pg_pool.ThreadedConnectionPool | None = None


def init_pool() -> None:
    global _pool
    settings = get_settings()
    _pool = pg_pool.ThreadedConnectionPool(
        minconn=1,
        maxconn=10,
        dsn=settings.database_url,
    )
    logger.info("PostgreSQL connection pool initialised.")


def close_pool() -> None:
    global _pool
    if _pool:
        _pool.closeall()
        _pool = None
        logger.info("PostgreSQL connection pool closed.")


@contextlib.contextmanager
def get_conn() -> Generator:
    """Yield a psycopg2 connection; auto-commit on success, rollback on error."""
    if _pool is None:
        raise RuntimeError("DB pool not initialised — call init_pool() first.")
    conn = _pool.getconn()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        _pool.putconn(conn)


def run_migrations() -> None:
    """Create tables if they don't already exist (idempotent)."""
    sql = """
    CREATE TABLE IF NOT EXISTS users (
        id          SERIAL PRIMARY KEY,
        email       TEXT UNIQUE NOT NULL,
        username    TEXT UNIQUE NOT NULL,
        hashed_pw   TEXT NOT NULL,
        is_admin    BOOLEAN NOT NULL DEFAULT FALSE,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        exam_type   TEXT NOT NULL,
        started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        finished_at TIMESTAMPTZ,
        score       NUMERIC(5,2),
        total_q     INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS question_history (
        id           SERIAL PRIMARY KEY,
        user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        session_id   INTEGER REFERENCES sessions(id) ON DELETE SET NULL,
        question_md5 TEXT NOT NULL,
        topic        TEXT,
        difficulty   TEXT,
        was_correct  BOOLEAN,
        answered_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS weak_topics (
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        topic      TEXT NOT NULL,
        miss_count INTEGER NOT NULL DEFAULT 1,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (user_id, topic)
    );

    CREATE INDEX IF NOT EXISTS idx_qhist_user  ON question_history(user_id);
    CREATE INDEX IF NOT EXISTS idx_qhist_topic ON question_history(topic);
    CREATE INDEX IF NOT EXISTS idx_weak_user   ON weak_topics(user_id);

    -- Stores generated questions server-side so correct answers are never
    -- exposed to the client until after submission.
    CREATE TABLE IF NOT EXISTS session_questions (
        id          SERIAL PRIMARY KEY,
        session_id  INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
        hash        TEXT NOT NULL,
        question    TEXT NOT NULL,
        option_a    TEXT NOT NULL,
        option_b    TEXT NOT NULL,
        option_c    TEXT NOT NULL,
        option_d    TEXT NOT NULL,
        correct     CHAR(1) NOT NULL CHECK (correct IN ('A','B','C','D')),
        explanation TEXT NOT NULL DEFAULT '',
        topic       TEXT NOT NULL DEFAULT '',
        difficulty  TEXT NOT NULL DEFAULT 'medium',
        position    INTEGER NOT NULL DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_sq_session ON session_questions(session_id);
    CREATE INDEX IF NOT EXISTS idx_sq_hash    ON session_questions(hash);
    """
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(sql)
    logger.info("Database migrations applied.")
