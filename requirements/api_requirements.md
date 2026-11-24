# REST API Requirements
## Campus Lost and Found Management System

### 1. Introduction

The REST API provides communication between the React frontend and the FastAPI backend of the Campus Lost and Found Management System. It enables users to authenticate, report lost and found items, search for items, submit ownership claims and manage recovery requests.

### 2. API Design Standards

- API Base URL: `/api`
- Communication Protocol: HTTP/HTTPS
- Data Format: JSON
- Architecture: REST
- Backend Framework: Python FastAPI
- Database: SQLite
- Authentication: Token-based authentication (planned)
- HTTP Methods: GET, POST, PUT, PATCH and DELETE

### 3. User Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Retrieve the logged-in user's profile |
| POST | `/api/auth/logout` | End the user's session |

### 4. Item Management APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/items` | Create a lost or found item report |
| GET | `/api/items` | Retrieve all available item reports |
| GET | `/api/items/{item_id}` | Retrieve details of a specific item |
| PUT | `/api/items/{item_id}` | Update an item report |
| DELETE | `/api/items/{item_id}` | Delete an item report, subject to authorization |

Item reports should support the following information:
- Item name
- Description
- Category
- Location
- Report type (Lost or Found)
- Report date
- Image path (optional)
- Item status

### 5. Search and Filtering APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/items/search` | Search items using keywords |
| GET | `/api/items/filter` | Filter items by category, location, report type or status |

### 6. Ownership Claim Management APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/claims` | Submit an ownership claim |
| GET | `/api/claims` | Retrieve claims belonging to the authorized user |
| GET | `/api/claims/{claim_id}` | Retrieve details of a specific claim |
| PATCH | `/api/claims/{claim_id}/review` | Approve or reject a claim by an authorized administrator |

Each ownership claim should contain:
- Item ID
- Claiming user ID
- Claim details
- Claim date
- Claim status
- Administrator review information

### 7. Administrator APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Retrieve dashboard statistics |
| GET | `/api/admin/items` | View and manage reported items |
| GET | `/api/admin/claims` | View ownership claims requiring review |
| PATCH | `/api/admin/items/{item_id}/status` | Update an item's status |

Administrator endpoints must be accessible only to authorized administrators.

### 8. Common HTTP Response Codes

| Status Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created successfully |
| 204 | Request successful with no response body |
| 400 | Invalid request |
| 401 | Authentication required or invalid credentials |
| 403 | Access forbidden |
| 404 | Requested resource not found |
| 409 | Resource conflict |
| 422 | Input validation error |
| 500 | Internal server error |

### 9. API Security Requirements

- Authentication must be required for protected operations.
- Passwords must never be stored in plain text.
- Role-based access must distinguish students, college staff and administrators.
- Users must only modify resources they are authorized to access.
- Input validation must be performed before processing requests.
- Sensitive information must not be exposed in API responses.
- CORS must be configured to allow requests from approved frontend origins.

### 10. General API Requirements

- API requests and responses should use JSON.
- Each endpoint must have a clearly defined purpose.
- Invalid requests must return appropriate error responses.
- The API should support searching and filtering item reports.
- The API must maintain consistency between item reports and ownership claims.
- The API should be documented using FastAPI Swagger UI.

### 11. Conclusion

The proposed REST API provides the communication structure required for the Campus Lost and Found Management System. It separates frontend and backend responsibilities and defines the operations needed for authentication, item reporting, searching, ownership verification and administration.

These endpoints represent the planned API specification and will be implemented and validated during backend development.