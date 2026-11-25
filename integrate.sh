
#!/bin/bash

# Campus Lost & Found - Integration Runner
# Run from the project root: ./integrate.sh

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
VENV="$ROOT_DIR/.venv"
LOG_DIR="$ROOT_DIR/logs"

BACKEND_PID=""
FRONTEND_PID=""

mkdir -p "$LOG_DIR"

PASS=0
FAIL=0

green() { printf "\033[32m%s\033[0m\n" "$1"; }
red()   { printf "\033[31m%s\033[0m\n" "$1"; }
blue()  { printf "\033[34m%s\033[0m\n" "$1"; }

check() {
    if "$@"; then
        green "PASS: $1"
        PASS=$((PASS + 1))
    else
        red "FAIL: $1"
        FAIL=$((FAIL + 1))
        return 1
    fi
}

cleanup() {
    echo
    blue "Stopping development servers..."

    [[ -n "$FRONTEND_PID" ]] && kill "$FRONTEND_PID" 2>/dev/null || true
    [[ -n "$BACKEND_PID" ]] && kill "$BACKEND_PID" 2>/dev/null || true

    wait 2>/dev/null || true
    echo "Servers stopped."
}

trap cleanup EXIT INT TERM

echo "=========================================="
echo " CAMPUS LOST & FOUND INTEGRATION"
echo "=========================================="

# 1. Project structure
blue "\n[1/7] Checking project structure"

for path in "$BACKEND_DIR/app/main.py" \
            "$FRONTEND_DIR/package.json" \
            "$VENV/bin/python"; do
    if [[ -e "$path" ]]; then
        green "PASS: Found $path"
        PASS=$((PASS + 1))
    else
        red "FAIL: Missing $path"
        FAIL=$((FAIL + 1))
    fi
done

if [[ "$FAIL" -gt 0 ]]; then
    echo "Fix missing project files before continuing."
    exit 1
fi

# 2. Environment
blue "\n[2/7] Configuring environment"

source "$VENV/bin/activate"

# Load an existing backend .env if present.
if [[ -f "$BACKEND_DIR/.env" ]]; then
    set -a
    source "$BACKEND_DIR/.env"
    set +a
elif [[ -f "$ROOT_DIR/.env" ]]; then
    set -a
    source "$ROOT_DIR/.env"
    set +a
fi

# Generate a temporary development key if none is configured.
if [[ -z "${JWT_SECRET_KEY:-}" ]]; then
    export JWT_SECRET_KEY
    JWT_SECRET_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(48))')"
    echo "Generated a temporary JWT secret for this run."
fi

# 3. Frontend validation
blue "\n[3/7] Running frontend checks"

cd "$FRONTEND_DIR"

if [[ ! -d node_modules ]]; then
    echo "Installing frontend dependencies..."
    npm install
fi

if npm run typecheck; then
    green "PASS: Frontend TypeScript"
    PASS=$((PASS + 1))
else
    red "FAIL: Frontend TypeScript"
    FAIL=$((FAIL + 1))
fi

if npm run build; then
    green "PASS: Frontend production build"
    PASS=$((PASS + 1))
else
    red "FAIL: Frontend production build"
    FAIL=$((FAIL + 1))
fi

if [[ "$FAIL" -gt 0 ]]; then
    echo "Fix frontend errors before starting servers."
    exit 1
fi

# 4. Backend import check
blue "\n[4/7] Checking backend imports"

cd "$BACKEND_DIR"

if python -c "from app.main import app; print('FastAPI import successful')"; then
    green "PASS: Backend imports"
    PASS=$((PASS + 1))
else
    red "FAIL: Backend imports"
    FAIL=$((FAIL + 1))
    exit 1
fi

# 5. Start backend
blue "\n[5/7] Starting backend"

if lsof -iTCP:8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    red "Port 8000 is already in use. Stop the existing backend first."
    exit 1
fi

uvicorn app.main:app --host 127.0.0.1 --port 8000 \
    > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!

BACKEND_READY=0

for i in {1..30}; do
    if curl -fsS http://127.0.0.1:8000/api/health >/dev/null 2>&1; then
        BACKEND_READY=1
        break
    fi
    sleep 1
done

if [[ "$BACKEND_READY" -eq 1 ]]; then
    green "PASS: Backend health endpoint"
    PASS=$((PASS + 1))
else
    red "FAIL: Backend did not become healthy"
    tail -40 "$LOG_DIR/backend.log"
    exit 1
fi

# 6. Check API endpoints
blue "\n[6/7] Checking API connectivity"

for endpoint in "/api/items" "/api/found-items"; do
    if curl -fsS "http://127.0.0.1:8000$endpoint" >/dev/null; then
        green "PASS: $endpoint"
        PASS=$((PASS + 1))
    else
        red "FAIL: $endpoint"
        FAIL=$((FAIL + 1))
    fi
done

# 7. Start frontend
blue "\n[7/7] Starting frontend"

cd "$FRONTEND_DIR"

if lsof -iTCP:3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    red "Port 3000 is already in use. Stop the existing frontend first."
    exit 1
fi

npm run dev -- --host 127.0.0.1 \
    > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!

FRONTEND_READY=0

for i in {1..30}; do
    if curl -fsS http://127.0.0.1:3000/ >/dev/null 2>&1; then
        FRONTEND_READY=1
        break
    fi
    sleep 1
done

if [[ "$FRONTEND_READY" -eq 1 ]]; then
    green "PASS: Frontend is responding"
    PASS=$((PASS + 1))
else
    red "FAIL: Frontend did not become ready"
    tail -40 "$LOG_DIR/frontend.log"
    exit 1
fi

echo
echo "=========================================="
echo " INTEGRATION SUMMARY"
echo "=========================================="
green "Passed: $PASS"
red "Failed: $FAIL"

echo
echo "Frontend: http://localhost:3000"
echo "Backend:  http://127.0.0.1:8000"
echo "API Docs: http://127.0.0.1:8000/docs"
echo
echo "Backend log: $LOG_DIR/backend.log"
echo "Frontend log: $LOG_DIR/frontend.log"
echo
echo "Press Ctrl+C to stop both servers."

# Keep script alive while both servers run.
while kill -0 "$BACKEND_PID" 2>/dev/null &&
      kill -0 "$FRONTEND_PID" 2>/dev/null; do
    sleep 2
done

echo "A development server stopped unexpectedly."
exit 1
