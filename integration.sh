
#!/bin/bash

# Campus Lost & Found - Master Integration Script
# macOS / Bash compatible

set -u

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"
DB="$ROOT/database/campus_lost_found.db"
PYTHON="$ROOT/.venv/bin/python"
LOG_DIR="$ROOT/logs"
RESULTS="$LOG_DIR/integration-results.txt"

BACKEND_PID=""
FRONTEND_PID=""
TMP="$(mktemp -d)"

mkdir -p "$LOG_DIR"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

log() {
    echo -e "$1"
}

pass() {
    PASS=$((PASS + 1))
    log "${GREEN}[PASS]${NC} $1"
    echo "[PASS] $1" >> "$RESULTS"
}

fail() {
    FAIL=$((FAIL + 1))
    log "${RED}[FAIL]${NC} $1"
    echo "[FAIL] $1" >> "$RESULTS"
}

warn() {
    WARN=$((WARN + 1))
    log "${YELLOW}[WARN]${NC} $1"
    echo "[WARN] $1" >> "$RESULTS"
}

cleanup() {
    log "\n${YELLOW}Stopping servers started by integration.sh...${NC}"

    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi

    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi

    rm -rf "$TMP"

    log "${GREEN}Cleanup complete.${NC}"
}

trap cleanup EXIT INT TERM

api() {
    METHOD="$1"
    ENDPOINT="$2"
    OUTPUT="$3"
    DATA="${4:-}"
    TOKEN="${5:-}"

    if [ -n "$DATA" ] && [ -n "$TOKEN" ]; then
        curl -sS --max-time 10 \
            -X "$METHOD" \
            "http://127.0.0.1:8000$ENDPOINT" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "$DATA" \
            -o "$OUTPUT" \
            -w "%{http_code}" || echo "000"
    elif [ -n "$DATA" ]; then
        curl -sS --max-time 10 \
            -X "$METHOD" \
            "http://127.0.0.1:8000$ENDPOINT" \
            -H "Content-Type: application/json" \
            -d "$DATA" \
            -o "$OUTPUT" \
            -w "%{http_code}" || echo "000"
    elif [ -n "$TOKEN" ]; then
        curl -sS --max-time 10 \
            -X "$METHOD" \
            "http://127.0.0.1:8000$ENDPOINT" \
            -H "Authorization: Bearer $TOKEN" \
            -o "$OUTPUT" \
            -w "%{http_code}" || echo "000"
    else
        curl -sS --max-time 10 \
            -X "$METHOD" \
            "http://127.0.0.1:8000$ENDPOINT" \
            -o "$OUTPUT" \
            -w "%{http_code}" || echo "000"
    fi
}

json_field() {
    "$PYTHON" -c '
import json,sys
try:
    data=json.load(open(sys.argv[1]))
    value=data
    for key in sys.argv[2].split("."):
        value=value[key]
    print(value)
except Exception:
    print("")
' "$1" "$2"
}

check_port() {
    PORT="$1"
    if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
        return 1
    fi
    return 0
}

wait_for_backend() {
    for i in $(seq 1 30); do
        if curl -fsS http://127.0.0.1:8000/api/health >/dev/null 2>&1; then
            return 0
        fi
        sleep 1
    done
    return 1
}

wait_for_frontend() {
    for i in $(seq 1 30); do
        if curl -fsS http://127.0.0.1:3000/ >/dev/null 2>&1; then
            return 0
        fi
        sleep 1
    done
    return 1
}

echo "=========================================="
echo " CAMPUS LOST & FOUND - INTEGRATION TESTS"
echo "=========================================="

: > "$RESULTS"

# --------------------------------------------------
# PHASE 1: ENVIRONMENT CHECKS
# --------------------------------------------------

log "\n${BLUE}PHASE 1: ENVIRONMENT CHECKS${NC}"

if [ -x "$PYTHON" ]; then
    pass "Python virtual environment found"
else
    fail "Python virtual environment missing"
    exit 1
fi

if command -v node >/dev/null 2>&1 &&
   command -v npm >/dev/null 2>&1; then
    pass "Node.js and npm available"
else
    fail "Node.js or npm missing"
    exit 1
fi

if [ -d "$FRONTEND/node_modules" ]; then
    pass "Frontend dependencies installed"
else
    warn "Installing frontend dependencies"
    (cd "$FRONTEND" && npm install) || exit 1
fi

if [ -f "$DB" ]; then
    pass "Existing SQLite database found"
else
    warn "SQLite database not found yet; backend may create it"
fi

if ! check_port 8000; then
    fail "Port 8000 is occupied. Stop the existing backend first."
    exit 1
fi

if ! check_port 3000; then
    fail "Port 3000 is occupied. Stop the existing frontend first."
    exit 1
fi

pass "Ports 8000 and 3000 are available"

export JWT_SECRET_KEY="${JWT_SECRET_KEY:-$(openssl rand -hex 32)}"

# --------------------------------------------------
# PHASE 2: FRONTEND QUALITY CHECKS
# --------------------------------------------------

log "\n${BLUE}PHASE 2: FRONTEND QUALITY CHECKS${NC}"

if (cd "$FRONTEND" && npm run typecheck) \
    > "$LOG_DIR/typecheck.log" 2>&1; then
    pass "TypeScript validation"
else
    fail "TypeScript validation (see logs/typecheck.log)"
fi

if (cd "$FRONTEND" && npm run build) \
    > "$LOG_DIR/build.log" 2>&1; then
    pass "Frontend production build"
else
    fail "Frontend production build (see logs/build.log)"
fi

# --------------------------------------------------
# PHASE 3: START SERVERS
# --------------------------------------------------

log "\n${BLUE}PHASE 3: STARTING SERVERS${NC}"

(
    cd "$BACKEND"
    exec "$PYTHON" -m uvicorn app.main:app \
        --app-dir "$BACKEND" \
        --host 127.0.0.1 \
        --port 8000
) > "$LOG_DIR/backend.log" 2>&1 &

BACKEND_PID=$!

(
    cd "$FRONTEND"
    exec ./node_modules/.bin/vite \
        --host 127.0.0.1 \
        --port 3000 \
        --strictPort
) > "$LOG_DIR/frontend.log" 2>&1 &

FRONTEND_PID=$!

if wait_for_backend; then
    pass "FastAPI backend started"
else
    fail "FastAPI backend failed (see logs/backend.log)"
    exit 1
fi

if wait_for_frontend; then
    pass "Vite frontend started"
else
    fail "Vite frontend failed (see logs/frontend.log)"
    exit 1
fi

# --------------------------------------------------
# PHASE 4: API HEALTH
# --------------------------------------------------

log "\n${BLUE}PHASE 4: API HEALTH CHECK${NC}"

HTTP=$(api GET "/api/health" "$TMP/health.json")

if [ "$HTTP" = "200" ]; then
    pass "Backend health endpoint"
else
    fail "Backend health endpoint returned HTTP $HTTP"
    exit 1
fi

# --------------------------------------------------
# PHASE 5: AUTHENTICATION
# --------------------------------------------------

log "\n${BLUE}PHASE 5: AUTHENTICATION TESTS${NC}"

STAMP="$(date +%s)"
EMAIL="integration_${STAMP}@example.com"
PASSWORD="IntegrationTest123!"
NAME="Integration Test User"

REGISTER_DATA=$("$PYTHON" -c '
import json,sys
print(json.dumps({
 "full_name":sys.argv[1],
 "email":sys.argv[2],
 "password":sys.argv[3],
 "role":"student"
}))
' "$NAME" "$EMAIL" "$PASSWORD")

HTTP=$(api POST "/api/auth/register" "$TMP/register.json" "$REGISTER_DATA")

if [ "$HTTP" = "201" ] || [ "$HTTP" = "200" ]; then
    pass "Student registration"
else
    fail "Registration returned HTTP $HTTP"
    cat "$TMP/register.json"
    exit 1
fi

LOGIN_DATA="username=$EMAIL&password=$PASSWORD"

HTTP=$(curl -sS --max-time 10 \
    -X POST http://127.0.0.1:8000/api/auth/login \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "$LOGIN_DATA" \
    -o "$TMP/login.json" \
    -w "%{http_code}" || echo "000")

TOKEN="$(json_field "$TMP/login.json" access_token)"

if [ "$HTTP" = "200" ] && [ -n "$TOKEN" ]; then
    pass "Student login"
else
    fail "Login failed with HTTP $HTTP"
    cat "$TMP/login.json"
    exit 1
fi

HTTP=$(api GET "/api/auth/me" "$TMP/me.json" "" "$TOKEN")

if [ "$HTTP" = "200" ]; then
    pass "Authenticated profile retrieval"
else
    fail "Authenticated profile retrieval returned HTTP $HTTP"
fi

# --------------------------------------------------
# PHASE 6: LOST AND FOUND REPORTS
# --------------------------------------------------

log "\n${BLUE}PHASE 6: REPORT CREATION TESTS${NC}"

REPORT_DATE="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

LOST_NAME="Integration Lost Item $STAMP"
FOUND_NAME="Integration Found Item $STAMP"

LOST_DATA=$("$PYTHON" -c '
import json,sys
print(json.dumps({
 "item_name":sys.argv[1],
 "description":"Automated integration test lost item.",
 "category":"electronics",
 "location":"Integration Test Location",
 "report_type":"Lost",
 "report_date":sys.argv[2]
}))
' "$LOST_NAME" "$REPORT_DATE")

HTTP=$(api POST "/api/items" "$TMP/lost.json" "$LOST_DATA" "$TOKEN")

LOST_ID="$(json_field "$TMP/lost.json" item_id)"

if [ "$HTTP" = "201" ] || [ "$HTTP" = "200" ]; then
    pass "Lost item creation"
else
    fail "Lost item creation returned HTTP $HTTP"
    cat "$TMP/lost.json"
fi

FOUND_DATA=$("$PYTHON" -c '
import json,sys
print(json.dumps({
 "item_name":sys.argv[1],
 "description":"Automated integration test found item.",
 "category":"electronics",
 "location":"Integration Test Location",
 "report_type":"Found",
 "report_date":sys.argv[2]
}))
' "$FOUND_NAME" "$REPORT_DATE")

HTTP=$(api POST "/api/found-items" "$TMP/found.json" "$FOUND_DATA" "$TOKEN")

FOUND_ID="$(json_field "$TMP/found.json" item_id)"

if [ "$HTTP" = "201" ] || [ "$HTTP" = "200" ]; then
    pass "Found item creation"
else
    fail "Found item creation returned HTTP $HTTP"
    cat "$TMP/found.json"
fi

# --------------------------------------------------
# PHASE 7: REPORT RETRIEVAL
# --------------------------------------------------

log "\n${BLUE}PHASE 7: REPORT RETRIEVAL TESTS${NC}"

HTTP=$(api GET "/api/items" "$TMP/lost-list.json")

if [ "$HTTP" = "200" ] &&
   grep -q "$LOST_NAME" "$TMP/lost-list.json"; then
    pass "Lost report appears in public listing"
else
    fail "Lost report retrieval"
fi

HTTP=$(api GET "/api/found-items" "$TMP/found-list.json")

if [ "$HTTP" = "200" ] &&
   grep -q "$FOUND_NAME" "$TMP/found-list.json"; then
    pass "Found report appears in public listing"
else
    fail "Found report retrieval"
fi

if [ -n "$LOST_ID" ]; then
    HTTP=$(api GET "/api/items/$LOST_ID" "$TMP/lost-detail.json")
    if [ "$HTTP" = "200" ]; then
        pass "Individual lost report retrieval"
    else
        fail "Individual lost report retrieval"
    fi
fi

# --------------------------------------------------
# PHASE 8: CLAIMS API
# --------------------------------------------------

log "\n${BLUE}PHASE 8: CLAIMS API CHECK${NC}"

HTTP=$(api GET "/api/claims" "$TMP/claims.json" "" "$TOKEN")

if [ "$HTTP" = "200" ]; then
    pass "Authenticated claims endpoint"
else
    warn "Claims endpoint returned HTTP $HTTP; inspect backend permissions"
fi

# --------------------------------------------------
# PHASE 9: SQLITE PERSISTENCE
# --------------------------------------------------

log "\n${BLUE}PHASE 9: SQLITE PERSISTENCE${NC}"

if [ -f "$DB" ] && [ -n "$LOST_ID" ] && [ -n "$FOUND_ID" ]; then

    "$PYTHON" - "$DB" "$LOST_ID" "$FOUND_ID" <<'PY' > "$TMP/db-check.txt"
import sqlite3,sys

db, lost_id, found_id = sys.argv[1:]
con = sqlite3.connect(db)

tables = [
    row[0] for row in
    con.execute("SELECT name FROM sqlite_master WHERE type='table'")
]

target = None

for table in tables:
    columns = [
        row[1] for row in con.execute(f'PRAGMA table_info("{table}")')
    ]
    if "item_id" in columns and "item_name" in columns:
        target = table
        break

if not target:
    print("ITEM_TABLE_NOT_FOUND")
    sys.exit(1)

ids = {
    str(row[0]) for row in
    con.execute(f'SELECT item_id FROM "{target}"')
}

if lost_id in ids and found_id in ids:
    print("PERSISTENCE_VERIFIED")
else:
    print("PERSISTENCE_NOT_VERIFIED")

con.close()
PY

    if grep -q "PERSISTENCE_VERIFIED" "$TMP/db-check.txt"; then
        pass "Lost and found reports persisted in SQLite"
    else
        fail "SQLite persistence verification"
        cat "$TMP/db-check.txt"
    fi
else
    warn "SQLite verification skipped; database or report IDs unavailable"
fi

# --------------------------------------------------
# PHASE 10: FEATURE GAP REPORT
# --------------------------------------------------

log "\n${BLUE}PHASE 10: FEATURE SUPPORT REPORT${NC}"

warn "Image upload/storage requires a backend upload endpoint"
warn "Reporter contact retrieval requires a backend endpoint"
warn "Report resolution/reopening requires backend status support"
warn "Flagging and moderation require backend routes"
warn "Claims frontend workflow still requires integration"

# --------------------------------------------------
# FINAL SUMMARY
# --------------------------------------------------

echo ""
echo "=========================================="
echo "          INTEGRATION SUMMARY"
echo "=========================================="
echo -e "${GREEN}Passed: $PASS${NC}"
echo -e "${RED}Failed: $FAIL${NC}"
echo -e "${YELLOW}Warnings: $WARN${NC}"
echo "=========================================="

echo ""
echo "Results: logs/integration-results.txt"
echo "Backend log: logs/backend.log"
echo "Frontend log: logs/frontend.log"
echo "Typecheck log: logs/typecheck.log"
echo "Build log: logs/build.log"

echo ""
echo "Test account: $EMAIL"
echo "Lost report ID: $LOST_ID"
echo "Found report ID: $FOUND_ID"

if [ "$FAIL" -gt 0 ]; then
    exit 1
fi

log "\n${GREEN}Core integration checks completed.${NC}"
