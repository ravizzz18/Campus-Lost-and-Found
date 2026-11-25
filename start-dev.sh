
#!/bin/bash

set -u

# Project directory
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
VENV_PYTHON="$PROJECT_DIR/.venv/bin/python"

LOG_DIR="$PROJECT_DIR/logs"

BACKEND_PID=""
FRONTEND_PID=""

# Colors
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
    echo -e "${RED}Error: Python virtual environment not found.${NC}"
    exit 1
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    (cd "$FRONTEND_DIR" && npm install) || exit 1
fi

# Generate a development JWT secret if not already configured
export JWT_SECRET_KEY="${JWT_SECRET_KEY:-$(openssl rand -hex 32)}"

# Stop both servers when script exits
cleanup() {
    echo ""
    echo -e "${YELLOW}Stopping development servers...${NC}"

    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi

    if [ -n "$BACKEND_PID" ]; then
        pkill -TERM -P "$BACKEND_PID" 2>/dev/null || true
        kill "$BACKEND_PID" 2>/dev/null || true
    fi

    echo -e "${GREEN}Development servers stopped.${NC}"
    exit 0
}

trap cleanup INT TERM

# Start backend
echo -e "${BLUE}[1/2] Starting FastAPI backend...${NC}"

(
    cd "$BACKEND_DIR"
    exec "$VENV_PYTHON" -m uvicorn app.main:app \
        --app-dir "$BACKEND_DIR" \
        --host 127.0.0.1 \
        --port 8000 \
        --reload
) > "$LOG_DIR/backend.log" 2>&1 &

BACKEND_PID=$!

# Start frontend
echo -e "${BLUE}[2/2] Starting React frontend...${NC}"

(
    cd "$FRONTEND_DIR"
    npm run dev -- --host 127.0.0.1
) > "$LOG_DIR/frontend.log" 2>&1 &

FRONTEND_PID=$!

echo ""
echo "=========================================="
echo -e "${GREEN}   DEVELOPMENT SERVERS STARTED${NC}"
echo "=========================================="
echo ""
echo -e "${GREEN}Frontend:${NC}  http://localhost:3000"
echo -e "${GREEN}Backend:${NC}   http://127.0.0.1:8000"
echo -e "${GREEN}Swagger:${NC}   http://127.0.0.1:8000/docs"
echo ""
echo "Logs:"
echo "  Backend  : logs/backend.log"
echo "  Frontend : logs/frontend.log"
echo ""
echo -e "${YELLOW}Press CTRL+C to stop both servers.${NC}"
echo ""

# Keep script running while servers operate
while kill -0 "$BACKEND_PID" 2>/dev/null &&
      kill -0 "$FRONTEND_PID" 2>/dev/null; do
    sleep 2
done

echo -e "${RED}A development server has stopped. Check the logs.${NC}"
cleanup
