# Campus Lost and Found – Database

## 1. Overview

This directory contains the database documentation, Entity Relationship Diagram (ERD), initialization scripts, verification utilities, testing reports, and maintenance procedures for the Campus Lost and Found Management System.

The project uses SQLite for local database storage and SQLAlchemy as its Object Relational Mapping (ORM) framework.

## 2. Database Technology

| Component | Technology |
|---|---|
| Database Management System | SQLite |
| Object Relational Mapper | SQLAlchemy |
| Database Language | SQL |
| Backend Framework | FastAPI |
| Database File | `campus_lost_found.db` |

## 3. Database Tables

The system consists of four main database tables.

| Table | Description |
|---|---|
| `users` | Stores user registration, authentication and account information. |
| `items` | Stores information about lost and found items reported by users. |
| `claims` | Stores claims submitted by users for found items and their review status. |
| `revoked_tokens` | Stores revoked JWT tokens to support logout and token invalidation. |

### 3.1 Database Relationships

- One user can report multiple items.
- One user can submit multiple claims.
- One item can receive multiple claims.
- An administrator can review multiple claims.
- Revoked tokens are stored separately to support authentication security.

## 4. Directory Structure

```text
database/
├── campus_lost_found.db
├── README.md
├── design/
│   ├── database_schema.md
│   ├── data_dictionary.md
│   ├── database_maintenance.md
│   ├── database_testing.md
│   └── erDiagram.png
└── scripts/
    ├── init_db.py
    └── verify_db.py
```

## 5. Database Initialization

The database initialization script is located at:

`database/scripts/init_db.py`

To initialize the database, execute the following command from the project root directory:

```powershell
python database/scripts/init_db.py
```

The script imports the SQLAlchemy models and creates the required database tables if they do not already exist.

The initialization process creates or verifies the following tables:

- users
- items
- claims
- revoked_tokens

## 6. Database Verification

The project includes an automated database verification utility:

`database/scripts/verify_db.py`

Execute the following command:

```powershell
python database/scripts/verify_db.py
```

The verification utility performs the following checks:

1. SQLite database integrity verification.
2. Required database table existence.
3. Primary key verification.
4. Foreign-key relationship verification.

A successful verification displays:

```text
Integrity Check: ok
DATABASE VERIFICATION COMPLETED SUCCESSFULLY
```

This utility helps identify missing tables, database integrity issues and missing key relationships.

## 7. Database Models

The SQLAlchemy database models are maintained in:

`backend/app/models/`

The models define the structure, attributes, constraints and relationships of the database tables.

The database initialization script imports these models to create the database schema.

## 8. Database Design Documentation

The `design/` directory contains the following documentation:

| File | Description |
|---|---|
| `database_schema.md` | Describes the database schema and table definitions. |
| `data_dictionary.md` | Documents database fields, data types and constraints. |
| `database_maintenance.md` | Explains database backup, restoration and maintenance procedures. |
| `database_testing.md` | Documents database verification and API integration testing results. |
| `erDiagram.png` | Visual representation of database entities and relationships. |

## 9. Database Maintenance

Database maintenance procedures are documented in:

`database/design/database_maintenance.md`

The guide covers:

- Database initialization.
- Database integrity verification.
- Database backup and restoration.
- SQLite inspection commands.
- Troubleshooting common database problems.

Regular database backups and integrity checks help maintain database consistency and reliability.

## 10. Database Testing

Database and API integration testing results are documented in:

`database/design/database_testing.md`

The testing report covers:

- Found Item API integration testing.
- Claim Management API integration testing.
- INSERT, SELECT, UPDATE and DELETE operations exercised through the APIs.
- Database table and primary key verification.
- SQLite integrity verification.
- Testing results and limitations.

The existing integration scripts and database verification utility can be executed using the commands documented in the testing report.

## 11. Security and Data Protection

- Passwords are stored as password hashes rather than plain text.
- JWT token revocation is supported through the `revoked_tokens` table.
- Database access is managed through SQLAlchemy sessions.
- Local database files containing user information should not be committed to the public repository.
- Database backups containing user information should also remain excluded from version control.

## 12. Notes

- SQLite is used for local database storage.
- SQLAlchemy handles database operations.
- Database models are maintained separately from database documentation.
- The local `.db` file is excluded from Git through `.gitignore`.
- The initialization and verification scripts should be executed from the project root directory.

## 13. Conclusion

The database module provides structured storage for users, lost and found items, claims and revoked authentication tokens.

The combination of database schema documentation, an Entity Relationship Diagram, SQLAlchemy models, initialization utilities, automated verification and testing documentation helps maintain the consistency, organization and reliability of the Campus Lost and Found Management System.