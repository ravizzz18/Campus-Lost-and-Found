
import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000"

EXPECTED_ENDPOINTS = {
    ("GET", "/api/found-items"),
    ("POST", "/api/found-items"),
    ("GET", "/api/found-items/search"),
    ("GET", "/api/found-items/filter"),
    ("GET", "/api/found-items/{item_id}"),
    ("PUT", "/api/found-items/{item_id}"),
    ("DELETE", "/api/found-items/{item_id}"),
}


def test_found_item_routes():
    print("\nChecking Found Item API routes...\n")

    try:
        with urllib.request.urlopen(
            f"{BASE_URL}/openapi.json",
            timeout=5
        ) as response:
            openapi = json.loads(response.read())

    except urllib.error.URLError as error:
        print(f"FAILED: Could not connect to backend: {error}")
        return False

    actual_endpoints = set()

    for path, methods in openapi.get("paths", {}).items():
        for method in methods:
            endpoint = (method.upper(), path)
            if endpoint in EXPECTED_ENDPOINTS:
                actual_endpoints.add(endpoint)

    missing = EXPECTED_ENDPOINTS - actual_endpoints

    for method, path in sorted(EXPECTED_ENDPOINTS):
        if (method, path) in actual_endpoints:
            print(f"PASS  {method:6} {path}")
        else:
            print(f"FAIL  {method:6} {path}")

    print("\n--------------------------------")
    print(f"Expected endpoints : {len(EXPECTED_ENDPOINTS)}")
    print(f"Registered endpoints: {len(actual_endpoints)}")
    print(f"Missing endpoints  : {len(missing)}")
    print("--------------------------------")

    if not missing:
        print("\nSUCCESS: All 7 Found Item APIs are registered!")
        print("Swagger documentation is correctly configured.")
        return True

    print("\nFAILED: Some Found Item APIs are missing.")
    return False


if __name__ == "__main__":
    if not test_found_item_routes():
        raise SystemExit(1)
