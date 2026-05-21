"""
One-time CLI utility to create the first admin user (or promote an existing one).

Usage (from /backend, venv activated):
    # Create a brand-new admin account:
    python -m scripts.create_admin --username admin --email admin@example.com --password secretpw

    # Promote an existing user to admin:
    python -m scripts.create_admin --promote --username existing_user
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from dotenv import load_dotenv
load_dotenv()

from app.database import init_pool, run_migrations, get_conn
from app.auth import hash_password


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Create or promote an admin user for the Elevate AI backend.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    p.add_argument("--username", required=True, help="Username for the admin account.")
    p.add_argument("--email", default="", help="Email (required when creating a new account).")
    p.add_argument("--password", default="", help="Password (required when creating a new account).")
    p.add_argument(
        "--promote",
        action="store_true",
        help="Promote an existing user to admin instead of creating a new one.",
    )
    return p.parse_args()


def create_admin(username: str, email: str, password: str) -> None:
    if not email or not password:
        print("ERROR: --email and --password are required when creating a new account.")
        sys.exit(1)
    if len(password) < 8:
        print("ERROR: Password must be at least 8 characters.")
        sys.exit(1)

    hashed = hash_password(password)
    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO users (username, email, hashed_pw, is_admin) "
                    "VALUES (%s, %s, %s, TRUE) RETURNING id",
                    (username.lower(), email.lower(), hashed),
                )
                user_id = cur.fetchone()[0]
        print(f"Admin user created — username: '{username}', id: {user_id}")
    except Exception as exc:
        if "unique" in str(exc).lower():
            print(f"ERROR: Username or email already exists. Use --promote to make an existing user an admin.")
        else:
            print(f"ERROR: {exc}")
        sys.exit(1)


def promote_admin(username: str) -> None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "UPDATE users SET is_admin = TRUE WHERE username = %s RETURNING id, email",
                (username.lower(),),
            )
            row = cur.fetchone()
    if not row:
        print(f"ERROR: No user with username '{username}' found.")
        sys.exit(1)
    print(f"User '{username}' (id={row[0]}, email={row[1]}) has been granted admin privileges.")


def main() -> None:
    args = parse_args()
    init_pool()
    run_migrations()

    if args.promote:
        promote_admin(args.username)
    else:
        create_admin(args.username, args.email, args.password)


if __name__ == "__main__":
    main()
