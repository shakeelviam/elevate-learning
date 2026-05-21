#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Elevate Learning — Backend Setup Script
# Run once from the /backend directory to bootstrap the Python environment.
# Requirements: Python 3.11+, PostgreSQL running locally, Ollama installed.
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

VENV_DIR=".venv"
PYTHON="${PYTHON:-python3}"

echo "==> Checking Python version..."
$PYTHON --version

echo "==> Creating virtual environment at $VENV_DIR ..."
$PYTHON -m venv "$VENV_DIR"

echo "==> Activating virtual environment..."
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"

echo "==> Upgrading pip..."
pip install --upgrade pip

echo "==> Installing dependencies from requirements.txt..."
pip install -r requirements.txt

echo ""
echo "==> Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env and fill in your PostgreSQL credentials:"
echo "       cp .env.example .env"
echo ""
echo "  2. Create the PostgreSQL database:"
echo "       createdb elevate_ai"
echo "       # or via psql: CREATE DATABASE elevate_ai;"
echo ""
echo "  3. Start the API server (runs DB migrations automatically on startup):"
echo "       source $VENV_DIR/bin/activate"
echo "       uvicorn main:app --reload --port 8000"
echo ""
echo "  4. Ingest a PDF (example):"
echo "       python -m scripts.ingest_pdf path/to/ielts_book.pdf --exam-type IELTS --difficulty medium"
echo ""
echo "  5. Verify everything is healthy:"
echo "       curl http://localhost:8000/health"
echo ""
