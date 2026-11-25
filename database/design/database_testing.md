# Database Testing Report

## 1. Introduction

This document describes the database and API integration testing performed for the Campus Lost and Found Management System.

The testing verifies database operations, claim management functionality, and the structural integrity of the SQLite database.

## 2. Testing Environment

| Component | Technology |
|---|---|
| Programming Language | Python 3.13.7 |
| Backend Framework | FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Testing Framework | Pytest 9.2.0 |
| API Server | Uvicorn |

## 3. Database Structure Verification

The database contains four tables:

- users
- items
- claims
- revoked_tokens

The verification script checks database availability, SQLite integrity, expected tables, primary keys, and declared foreign key relationships.

**Command:**
```powershell
python database/scripts/verify_db.py
```

**Results:**

| Verification | Status |
|---|---|
| SQLite integrity | PASS |
| Users table | PASS |
| Items table | PASS |
| Claims table | PASS |
| Revoked tokens table | PASS |
| Primary keys | PASS |
| Declared foreign keys | PASS |

## 4. Found Item API Integration Testing

**Command:**
```powershell
python backend/tests/test_found_item_api.py
```

| Test Case | Result |
|---|---|
| Register test user | PASS |
| Login test user | PASS |
| Create found item | PASS |
| Retrieve all found items | PASS |
| Verify item in list | PASS |
| Retrieve item by ID | PASS |
| Search found items | PASS |
| Verify search result | PASS |
| Filter found items | PASS |
| Verify filter result | PASS |
| Update found item | PASS |
| Verify updated details | PASS |
| Delete found item | PASS |
| Verify deletion | PASS |

**Result: 14 successful checks.**

Operations covered:
- INSERT: Create found items.
- SELECT: Retrieve records.
- UPDATE: Modify item details.
- DELETE: Remove records.
- SEARCH and FILTER: Retrieve records using conditions.

## 5. Claim Management API Integration Testing

**Command:**
```powershell
python backend/tests/test_claim_api.py
```

| Test Case | Result |
|---|---|
| Register reporter, claimant and other student | PASS |
| Login student accounts | PASS |
| Create temporary admin | PASS |
| Login admin | PASS |
| Create two found items | PASS |
| Submit two claims | PASS |
| Prevent duplicate pending claims | PASS |
| Retrieve student claims | PASS |
| Verify student's claim access restrictions | PASS |
| Restrict student review access | PASS |
| Admin retrieves all claims | PASS |
| Admin approves a claim | PASS |
| Verify approved claim status | PASS |
| Verify approved item is resolved | PASS |
| Admin rejects a claim | PASS |
| Verify rejected claim status | PASS |
| Prevent repeated claim review | PASS |

**Result: 26 successful checks.**

Operations covered:
- INSERT: Creating claims and test user accounts.
- SELECT: Retrieving claims and associated items.
- UPDATE: Approving and rejecting claims.
- Business rules: Preventing duplicate pending claims and repeated reviews.
- Relationship handling: Resolving an item after claim approval.

## 6. Pytest Execution

**Installation:**
```powershell
python -m pip install pytest
```

**Execution:**
```powershell
python -m pytest tests -v
```

**Result:**
- One test collected and passed.
- One warning was reported because the test function returned a Boolean instead of using assertions.
- The existing claim and found item integration scripts are standalone Python scripts and are not automatically collected by pytest.

## 7. Overall Testing Summary

| Testing Activity | Result |
|---|---:|
| Found Item API integration | 14 checks passed |
| Claim Management API integration | 26 checks passed |
| SQLite integrity verification | PASS |
| Pytest automated test | 1 passed |

A total of 40 successful checks were reported across the two API integration scripts.

## 8. Testing Limitations

The following areas were not independently verified:

- Lost Item API integration testing.
- Runtime enforcement of SQLite foreign key constraints.
- Dedicated pytest coverage for every database operation.
- Concurrent database access and performance under load.

The verification script checks declared foreign key relationships but does not independently test runtime enforcement.

## 9. Conclusion

The database and API integration tests were completed successfully for the tested Found Item and Claim Management operations.

The tests demonstrated successful record creation, retrieval, modification, deletion, claim processing, and database integrity verification.

The SQLite database maintained its expected table structure, primary keys, and declared foreign key relationships during verification.

These results provide evidence that the tested database operations are functioning