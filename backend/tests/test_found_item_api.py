
import json
import urllib.request
import urllib.error
import urllib.parse
import uuid
import sys

BASE_URL = "http://127.0.0.1:8000"

TEST_EMAIL = f"foundtest_{uuid.uuid4().hex[:10]}@example.com"
TEST_PASSWORD = "FoundTest123!"

created_item_id = None
token = None


def api_request(method, path, data=None, auth=False, form=False):
    url = BASE_URL + path

    headers = {"Accept": "application/json"}

    if form:
        body = urllib.parse.urlencode(data).encode()
        headers["Content-Type"] = "application/x-www-form-urlencoded"
    elif data is not None:
        body = json.dumps(data).encode()
        headers["Content-Type"] = "application/json"
    else:
        body = None

    if auth:
        headers["Authorization"] = f"Bearer {token}"

    request = urllib.request.Request(
        url,
        data=body,
        headers=headers,
        method=method
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            response_body = response.read().decode()
            return response.status, (
                json.loads(response_body) if response_body else None
            )

    except urllib.error.HTTPError as error:
        response_body = error.read().decode()

        try:
            response_data = json.loads(response_body)
        except json.JSONDecodeError:
            response_data = response_body

        return error.code, response_data


def check(name, actual, expected):
    if actual != expected:
        print(f"FAIL  {name} | Expected {expected}, received {actual}")
        print("Response:", actual)
        raise SystemExit(1)

    print(f"PASS  {name} | HTTP {actual}")


def run_tests():
    global token, created_item_id

    print("\n====================================")
    print(" FOUND ITEM API INTEGRATION TEST")
    print("====================================\n")

    # 1. Register a test user
    status_code, response = api_request(
        "POST",
        "/api/auth/register",
        {
            "full_name": "Found API Test User",
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        }
    )

    check("Register test user", status_code, 201)

    # 2. Login and obtain access token
    status_code, response = api_request(
        "POST",
        "/api/auth/login",
        {
            "username": TEST_EMAIL,
            "password": TEST_PASSWORD
        },
        form=True
    )

    check("Login test user", status_code, 200)
    token = response["access_token"]

    # Prepare test item
    item_data = {
        "item_name": "AutomationBottle",
        "description": "Blue water bottle found near cafeteria",
        "category": "Accessories",
        "location": "College Cafeteria",
        "report_type": "Found",
        "report_date": "2026-11-24T14:30:00",
        "image_path": None
    }

    # 3. Create Found Item
    status_code, response = api_request(
        "POST",
        "/api/found-items",
        item_data,
        auth=True
    )

    check("Create Found Item", status_code, 201)
    created_item_id = response["item_id"]

    item_path = f"/api/found-items/{created_item_id}"

    # 4. Retrieve all Found Items
    status_code, response = api_request(
        "GET",
        "/api/found-items"
    )

    check("Get all Found Items", status_code, 200)

    if not any(item["item_id"] == created_item_id for item in response):
        raise AssertionError("Created item was not found in the list")

    print("PASS  Created item appears in Found Items list")

    # 5. Retrieve Found Item by ID
    status_code, response = api_request(
        "GET",
        item_path
    )

    check("Get Found Item by ID", status_code, 200)

    # 6. Search Found Items
    status_code, response = api_request(
        "GET",
        "/api/found-items/search?keyword=AutomationBottle"
    )

    check("Search Found Items", status_code, 200)

    if not any(item["item_id"] == created_item_id for item in response):
        raise AssertionError("Created item was not found by search")

    print("PASS  Search returned the created item")

    # 7. Filter Found Items
    filter_query = urllib.parse.urlencode({
        "category": "Accessories",
        "location": "College Cafeteria",
        "status": "active"
    })

    status_code, response = api_request(
        "GET",
        f"/api/found-items/filter?{filter_query}"
    )

    check("Filter Found Items", status_code, 200)

    if not any(item["item_id"] == created_item_id for item in response):
        raise AssertionError("Created item was not found by filter")

    print("PASS  Filter returned the created item")

    # 8. Update Found Item
    update_data = {
        "description": "Blue stainless steel bottle found near cafeteria",
        "location": "Central Cafeteria"
    }

    status_code, response = api_request(
        "PUT",
        item_path,
        update_data,
        auth=True
    )

    check("Update Found Item", status_code, 200)

    if response["location"] != "Central Cafeteria":
        raise AssertionError("Item location was not updated")

    print("PASS  Updated item details verified")

    # 9. Delete Found Item
    status_code, response = api_request(
        "DELETE",
        item_path,
        auth=True
    )

    check("Delete Found Item", status_code, 204)

    # 10. Verify deletion
    status_code, response = api_request(
        "GET",
        item_path
    )

    check("Verify deleted item returns 404", status_code, 404)

    print("\n====================================")
    print(" ALL FOUND ITEM API TESTS PASSED!")
    print("====================================")


if __name__ == "__main__":
    try:
        run_tests()
    except urllib.error.URLError as error:
        print("\nERROR: Could not connect to FastAPI.")
        print("Make sure the backend is running.")
        print(error)
        sys.exit(1)
    except Exception as error:
        print("\nTEST FAILED:", error)
        sys.exit(1)
