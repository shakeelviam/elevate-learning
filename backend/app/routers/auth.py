"""
Auth routes — register, login, me.
"""
import logging
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from psycopg2.errors import UniqueViolation

from app.auth import (
    create_access_token,
    db_create_user,
    db_get_user_by_username,
    get_current_user,
    hash_password,
    verify_password,
)
from app.schemas import LoginRequest, RegisterRequest, TokenResponse, UserPublic

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
async def register(body: RegisterRequest) -> TokenResponse:
    # Check username not already taken
    existing = db_get_user_by_username(body.username)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already taken.",
        )

    hashed = hash_password(body.password)
    try:
        created = db_create_user(
            username=body.username,
            email=body.email,
            hashed_pw=hashed,
        )
    except UniqueViolation:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with that email or username already exists.",
        )

    token = create_access_token(
        user_id=created["id"],
        username=body.username,
        is_admin=False,
    )
    logger.info("New user registered: %s (id=%d)", body.username, created["id"])
    return TokenResponse(
        access_token=token,
        user_id=created["id"],
        username=body.username,
        is_admin=False,
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Log in and receive a JWT access token",
)
async def login(body: LoginRequest) -> TokenResponse:
    user = db_get_user_by_username(body.username)
    if not user or not verify_password(body.password, user["hashed_pw"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
        )

    token = create_access_token(
        user_id=user["id"],
        username=user["username"],
        is_admin=user["is_admin"],
    )
    return TokenResponse(
        access_token=token,
        user_id=user["id"],
        username=user["username"],
        is_admin=user["is_admin"],
    )


@router.get(
    "/me",
    response_model=UserPublic,
    summary="Return the currently authenticated user's public profile",
)
async def me(current_user: dict[str, Any] = Depends(get_current_user)) -> UserPublic:
    from app.database import get_conn

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT id, email, username, is_admin, created_at "
                "FROM users WHERE id = %s",
                (current_user["user_id"],),
            )
            row = cur.fetchone()

    if not row:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    return UserPublic(
        id=row[0],
        email=row[1],
        username=row[2],
        is_admin=row[3],
        created_at=row[4],
    )
