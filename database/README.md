# Campus Lost and Found – Database

## 1. Overview

This directory contains the database documentation, Entity Relationship Diagram (ERD), initialization scripts, and local SQLite database for the Campus Lost and Found Management System.

## 2. Database Technology

- **DBMS:** SQLite
- **ORM:** SQLAlchemy
- **Database file:** campus_lost_found.db

## 3. Database Tables

The system consists of four main tables:

| Table | Description |
|---|---|
| users | Stores user registration and authentication details. |
| items | Stores lost and found item information. |
| claims | Stores claims submitted by users for found items. |
| revoked_tokens | Stores revoked JWT tokens to support logout and token invalidation. |

## 4. Directory Structure

```text
database/
├── campus_lost_found.db
├── README.md
├── design/
│   ├── database_schema.md
│   ├── data_dictionary.md
│   └── erDiagram.png
└── scripts/
    └── init_db.py