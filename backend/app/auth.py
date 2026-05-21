"""
Authentication utilities — JWT tokens + bcrypt password hashing.

All dependencies use FastAPI's Depends() system so they compose cleanly
across any router that needs authentication.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import get_settings
from app.database import get_conn

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
_bearer = HTTPBearer()


# ── Password ──────────────────────────────────────────────────────────────────

def hash_password(plain: str) -> str:
    return _pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    return _pwd_context.verify(plain, hashed)


# ── JWT ───────────────────────────────────────────────────────────────────────

def create_access_token(
    user_id: int,
    username: str,
    is_admin: bool,
) -> str:
    settings = get_settings()
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    payload: dict[str, Any] = {
        "sub": str(user_id),
        "username": username,
        "is_admin": is_admin,
        "exp": expire,
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.algorithm)


def _decode_token(token: str) -> dict[str, Any]:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


# ── FastAPI dependencies ──────────────────────────────────────────────────────

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> dict[str, Any]:
    """
    Validates the Bearer token and returns the decoded payload.
    Raises 401 if the token is missing, expired, or tampered with.
    """
    payload = _decode_token(credentials.credentials)
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload.")
    return {
        "user_id": int(user_id_str),
        "username": payload.get("username", ""),
        "is_admin": bool(payload.get("is_admin", False)),
    }


def get_current_admin(
    user: dict[str, Any] = Depends(get_current_user),
) -> dict[str, Any]:
    """Extends get_current_user — raises 403 if the user is not an admin."""
    if not user.get("is_admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return user


# ── DB helpers shared by auth routes ─────────────────────────────────────────

def db_get_user_by_username(username: str) -> dict[str, Any] | None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, email, username, hashed_pw, is_admin, created_at "
                "FROM users WHERE username = %s",
                (username.lower(),),
            )
            row = cur.fetchone()
    if not row:
        return None
    return {
        "id": row[0],
        "email": row[1],
        "username": row[2],
        "hashed_pw": row[3],
        "is_admin": row[4],
        "created_at": row[5],
    }


def db_create_user(username: str, email: str, hashed_pw: str) -> dict[str, Any]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (username, email, hashed_pw) "
                "VALUES (%s, %s, %s) RETURNING id, created_at",
                (username.lower(), email.lower(), hashed_pw),
            )
            row = cur.fetchone()
    return {"id": row[0], "created_at": row[1]}
