
import json
import os
import sys
import uuid
import urllib.request
import urllib.error
from urllib.parse import urlencode

# Allow imports from the backend directory
sys.path.insert(0, os.path.abspath("backend"))

from app.database import SessionLocal
from app.models.user import User
from app.auth.security import hash_password


BASE_URL = "http://127.0.0.1:8000"


# --------------------------------------------------
# API REQUEST HELPER
# --------------------------------------------------

def request_api(method, path, data=None, token=None, form=False):
    headers = {}
    body = None

    if token:
        headers["Authorization"] = f"Bearer {token}"

    if data is not None:
        if form:
            body = urlencode(data).encode()
            headers["Content-Type"] = "application/x-www-form-urlencoded"
        else:
            body = json.dumps(data).encode()
            headers["Content-Type"] = "application/json"

    req = urllib.request.Request(
        BASE_URL + path,
        data=body,
        headers=headers,
        method=method
    )

    try:
        with urllib.request.urlopen(req) as response:
            content = response.read()
            return response.status, (
                json.loads(content) if content else None
            )

    except urllib.error.HTTPError as error:
        content = error.read()

        try:
            result = json.loads(content) if content else None
        except json.JSONDecodeError:
            result = content.decode()

        return error.code, result


# --------------------------------------------------
# TEST ASSERTION
# --------------------------------------------------

def check(condition, message):
    if not condition:
        raise AssertionError(message)

    print(f"PASS: {message}")


# --------------------------------------------------
# USER REGISTRATION
# --------------------------------------------------

def register_user(name, email, password):
    status_code, result = request_api(
        "POST",
        "/api/auth/register",
        {
            "full_name": name,
            "email": email,
            "password": password
        }
    )

    check(status_code in (200, 201), f"Register {name}")
    return result


# --------------------------------------------------
# USER LOGIN
# --------------------------------------------------

def login(email, password):
    status_code, result = request_api(
        "POST",
        "/api/auth/login",
        {
            "username": email,
            "password": password
        },
        form=True
    )

    check(status_code == 200, f"Login {email}")

    return result["access_token"]


# --------------------------------------------------
# CREATE TEMPORARY ADMIN
# --------------------------------------------------

def create_admin(email, password):
    db = SessionLocal()

    try:
        admin = User(
            full_name="Test Admin",
            email=email,
            password_hash=hash_password(password),
            role="admin"
        )

        db.add(admin)
        db.commit()

        print("PASS: Create temporary admin account")

    finally:
        db.close()


# --------------------------------------------------
# MAIN TEST EXECUTION
# --------------------------------------------------

def main():

    unique = uuid.uuid4().hex[:10]
    password = "TestPass123!"

    reporter_email = f"reporter_{unique}@example.com"
    claimant_email = f"claimant_{unique}@example.com"
    other_email = f"other_{unique}@example.com"
    admin_email = f"admin_{unique}@example.com"

    print("\n========== CLAIM MANAGEMENT API TESTS ==========\n")

    # 1. Register student accounts
    register_user("Test Reporter", reporter_email, password)
    register_user("Test Claimant", claimant_email, password)
    register_user("Test Other Student", other_email, password)

    # 2. Login students
    reporter_token = login(reporter_email, password)
    claimant_token = login(claimant_email, password)
    other_token = login(other_email, password)

    # 3. Create admin account and login
    create_admin(admin_email, password)
    admin_token = login(admin_email, password)

    # 4. Create two found items
    item_ids = []

    for item_name in ["Test Found Laptop", "Test Found Wallet"]:

        status_code, item = request_api(
            "POST",
            "/api/found-items",
            {
                "item_name": item_name,
                "description": "Automated claim testing item",
                "category": "Electronics",
                "location": "College Library",
                "report_type": "Found",
                "report_date": "2026-11-24T10:00:00"
            },
            token=reporter_token
        )

        check(status_code == 201, f"Create {item_name}")
        item_ids.append(item["item_id"])

    # 5. Submit two claims
    claim_ids = []

    for item_id in item_ids:

        status_code, claim = request_api(
            "POST",
            "/api/claims",
            {
                "item_id": item_id,
                "claim_details": (
                    "This item belongs to me. "
                    "I can identify its unique features."
                )
            },
            token=claimant_token
        )

        check(status_code == 201, f"Submit claim for item {item_id}")
        claim_ids.append(claim["claim_id"])

    # 6. Test duplicate pending claim prevention
    status_code, _ = request_api(
        "POST",
        "/api/claims",
        {
            "item_id": item_ids[0],
            "claim_details": "Submitting a duplicate claim for testing."
        },
        token=claimant_token
    )

    check(status_code == 409, "Prevent duplicate pending claims")

    # 7. Student retrieves own claims
    status_code, claims = request_api(
        "GET",
        "/api/claims",
        token=claimant_token
    )

    check(status_code == 200, "Student retrieves own claims")
    check(len(claims) == 2, "Student sees exactly two own claims")

    # 8. Other student cannot access someone else's claim
    status_code, _ = request_api(
        "GET",
        f"/api/claims/{claim_ids[0]}",
        token=other_token
    )

    check(status_code == 403, "Other student cannot access claim")

    # 9. Student cannot review claims
    status_code, _ = request_api(
        "PATCH",
        f"/api/claims/{claim_ids[0]}/review",
        {
            "claim_status": "approved",
            "admin_review": "Test review"
        },
        token=claimant_token
    )

    check(status_code == 403, "Student cannot review claims")

    # 10. Admin retrieves all claims
    status_code, claims = request_api(
        "GET",
        "/api/claims",
        token=admin_token
    )

    check(status_code == 200, "Admin retrieves all claims")
    check(len(claims) == 2, "Admin sees both claims")

    # 11. Admin approves first claim
    status_code, approved_claim = request_api(
        "PATCH",
        f"/api/claims/{claim_ids[0]}/review",
        {
            "claim_status": "approved",
            "admin_review": "Ownership verified."
        },
        token=admin_token
    )

    check(status_code == 200, "Admin approves a claim")
    check(
        approved_claim["claim_status"] == "approved",
        "Claim status changes to approved"
    )

    # 12. Verify approved item is resolved
    status_code, approved_item = request_api(
        "GET",
        f"/api/found-items/{item_ids[0]}",
        token=reporter_token
    )

    check(status_code == 200, "Retrieve approved found item")
    check(
        approved_item["status"] == "resolved",
        "Approved claim resolves the found item"
    )

    # 13. Admin rejects second claim
    status_code, rejected_claim = request_api(
        "PATCH",
        f"/api/claims/{claim_ids[1]}/review",
        {
            "claim_status": "rejected",
            "admin_review": "Ownership could not be verified."
        },
        token=admin_token
    )

    check(status_code == 200, "Admin rejects a claim")
    check(
        rejected_claim["claim_status"] == "rejected",
        "Claim status changes to rejected"
    )

    # 14. Prevent reviewing an already reviewed claim
    status_code, _ = request_api(
        "PATCH",
        f"/api/claims/{claim_ids[0]}/review",
        {
            "claim_status": "rejected",
            "admin_review": "Attempting a second review."
        },
        token=admin_token
    )

    check(
        status_code == 409,
        "Prevent reviewing an already reviewed claim"
    )

    print("\n==============================================")
    print("ALL CLAIM MANAGEMENT API TESTS PASSED!")
    print("==============================================\n")


if __name__ == "__main__":
    main()
