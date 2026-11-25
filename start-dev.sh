#!/bin/bash

set -u

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
VENV_PYTHON="$PROJECT_DIR/.venv/bin/python"
LOG_DIR="$PROJECT_DIR/logs"

BACKEND_PID=""
FRONTEND_PID=""

BACKEND_OWNED=false
FRONTEND_OWNED=false

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

mkdir -p "$LOG_DIR"

echo ""
echo "=========================================="
echo "   CAMPUS LOST & FOUND - DEV SERVER"
echo "=========================================="
echo ""

# Check dependencies
if [ ! -x "$VENV_PYTHON" ]; then
    echo -e "${RED}Python virtual environment not found.${NC}"
    exit 1
fi

if [ ! -x "$FRONTEND_DIR/node_modules/.bin/vite" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    (cd "$FRONTEND_DIR" && npm install) || exit 1
fi

# Keep a consistent secret for this development session.
export JWT_SECRET_KEY="${JWT_SECRET_KEY:-$(openssl rand -hex 32)}"

port_in_use() {
    lsof -nP -iTCP:"$1" -sTCP:LISTEN >/dev/null 2>&1
}

wait_for_url() {
    local url="$1"
    local label="$2"
    local attempts=30

    echo -e "${BLUE}Waiting for $label...${NC}"

    for ((i=1; i<=attempts; i++)); do
        if curl -fsS "$url" >/dev/null 2>&1; then
            echo -e "${GREEN}$label is ready.${NC}"
            return 0
        fi
        sleep 1
    done

    echo -e "${RED}$label did not become ready. Check logs.${NC}"
    return 1
}

cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping servers started by this script...${NC}"

    if [ "$FRONTEND_OWNED" = true ] && [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi

    if [ "$BACKEND_OWNED" = true ] && [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi

    echo -e "${GREEN}Cleanup complete.${NC}"
    exit 0
}

trap cleanup INT TERM

# BACKEND
echo -e "${BLUE}[1/2] Checking FastAPI backend...${NC}"

if curl -fsS http://127.0.0.1:8000/api/health >/dev/null 2>&1; then
    echo -e "${GREEN}Backend already running on port 8000. Reusing it.${NC}"
elif port_in_use 8000; then
    echo -e "${RED}Port 8000 is occupied, but the backend health check failed.${NC}"
    lsof -nP -iTCP:8000 -sTCP:LISTEN
    exit 1
else
    echo "Starting FastAPI backend..."

    (
        cd "$BACKEND_DIR"
        exec "$VENV_PYTHON" -m uvicorn app.main:app \
            --app-dir "$BACKEND_DIR" \
            --host 127.0.0.1 \
            --port 8000
    ) > "$LOG_DIR/backend.log" 2>&1 &

    BACKEND_PID=$!
    BACKEND_OWNED=true

    if ! wait_for_url "http://127.0.0.1:8000/api/health" "Backend"; then
        echo ""
        tail -n 40 "$LOG_DIR/backend.log"
        cleanup
    fi
fi

# FRONTEND
echo ""
echo -e "${BLUE}[2/2] Checking React frontend...${NC}"

if curl -fsS http://127.0.0.1:3000 >/dev/null 2>&1; then
    echo -e "${GREEN}Frontend already running on port 3000. Reusing it.${NC}"
elif port_in_use 3000; then
    echo -e "${RED}Port 3000 is occupied, but frontend health check failed.${NC}"
    lsof -nP -iTCP:3000 -sTCP:LISTEN
    cleanup
else
    echo "Starting React frontend..."

    (
        cd "$FRONTEND_DIR"
        exec ./node_modules/.bin/vite \
            --host 127.0.0.1 \
            --port 3000 \
            --strictPort
    ) > "$LOG_DIR/frontend.log" 2>&1 &

    FRONTEND_PID=$!
    FRONTEND_OWNED=true

    if ! wait_for_url "http://127.0.0.1:3000" "Frontend"; then
        echo ""
        tail -n 40 "$LOG_DIR/frontend.log"
        cleanup
    fi
fi

echo ""
echo "=========================================="
echo -e "${GREEN}   DEVELOPMENT ENVIRONMENT READY${NC}"
echo "=========================================="
echo ""
echo -e "${GREEN}Frontend:${NC}  http://127.0.0.1:3000"
echo -e "${GREEN}Backend:${NC}   http://127.0.0.1:8000"
echo -e "${GREEN}Swagger:${NC}   http://127.0.0.1:8000/docs"
echo ""
echo "Logs:"
echo "  Backend  : logs/backend.log"
echo "  Frontend : logs/frontend.log"
echo ""
echo -e "${YELLOW}Press CTRL+C to stop servers started by this script.${NC}"
echo ""

# Monitor only processes started by this script.
while true; do
    if [ "$BACKEND_OWNED" = true ] && ! kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo -e "${RED}Backend process stopped. Check logs/backend.log${NC}"
        cleanup
    fi

    if [ "$FRONTEND_OWNED" = true ] && ! kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo -e "${RED}Frontend process stopped. Check logs/frontend.log${NC}"
        cleanup
    fi

    sleep 2
done
