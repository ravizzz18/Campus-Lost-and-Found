# Database Maintenance Guide

## 1. Overview

This document describes the procedures for initializing, verifying, backing up, restoring, and maintaining the SQLite database used by the Campus Lost and Found Management System.

**Database technology:** SQLite  
**ORM:** SQLAlchemy  
**Database file:** `database/campus_lost_found.db`

## 2. Database Initialization

The database can be initialized using the existing initialization script.

From the project root directory, execute:

```powershell
python database/scripts/init_db.py
```

The script imports the SQLAlchemy models and creates the required database tables if they do not already exist.

The database contains four tables:

- `users`
- `items`
- `claims`
- `revoked_tokens`

## 3. Database Verification

The database verification utility checks database integrity, required tables, primary keys, and foreign-key relationships.

Execute:

```powershell
python database/scripts/verify_db.py
```

A successful verification should display:

```text
Integrity Check: ok
DATABASE VERIFICATION COMPLETED SUCCESSFULLY
```

If verification fails, inspect the reported table or constraint before proceeding.

## 4. Database Backup

Regular backups help prevent accidental data loss.

Create a backup directory:

```powershell
New-Item -ItemType Directory -Force -Path database/backups
```

Create a timestamped SQLite backup using Python:

```powershell
python -c "import sqlite3, datetime; from pathlib import Path; src=Path('database/campus_lost_found.db'); dst=Path('database/backups/campus_lost_found_' + datetime.datetime.now().strftime('%Y%m%d_%H%M%S') + '.db'); source=sqlite3.connect(src); target=sqlite3.connect(dst); source.backup(target); target.close(); source.close(); print('Backup created:', dst)"
```

The SQLite backup API provides a consistent backup while the database is open.

## 5. Database Restoration

Before restoring a backup:

1. Stop the backend application.
2. Identify the backup file to restore.
3. Preserve the current database as an additional backup.
4. Restore the selected backup.
5. Run the database verification utility.

Example restoration command:

```powershell
Copy-Item "database/backups/your_backup_file.db" "database/campus_lost_found.db" -Force
```

Replace `your_backup_file.db` with the actual backup filename.

**Warning:** Restoration replaces the current database and may overwrite newer records.

## 6. SQLite Integrity Check

SQLite provides a built-in integrity check.

Run:

```powershell
python -c "import sqlite3; db=sqlite3.connect('database/campus_lost_found.db'); print(db.execute('PRAGMA integrity_check').fetchall()); db.close()"
```

Expected result:

```text
[('ok',)]
```

## 7. Useful Database Inspection Commands

Open the SQLite database through Python:

```powershell
python -c "import sqlite3; db=sqlite3.connect('database/campus_lost_found.db'); print(db.execute(\"SELECT name FROM sqlite_master WHERE type='table'\").fetchall()); db.close()"
```

Inspect the number of records in a table:

```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM items;
SELECT COUNT(*) FROM claims;
```

Inspect foreign-key definitions:

```sql
PRAGMA foreign_key_list(items);
PRAGMA foreign_key_list(claims);
```

## 8. Maintenance Recommendations

- Perform backups before major database changes.
- Verify database integrity after restoration.
- Stop the backend before manually replacing the database file.
- Never commit the local database file or backups containing user information to a public repository.
- Keep database models and schema documentation synchronized.
- Avoid manually modifying production records.

## 9. Troubleshooting

| Problem | Recommended action |
|---|---|
| Database file not found | Run the initialization script. |
| Missing table | Check model imports and rerun initialization. |
| Integrity check failure | Preserve the original file and investigate before restoring a backup. |
| Foreign-key issues | Inspect the relevant table relationships and constraints. |
| Database locked | Check whether another process is using the database. |

## 10. Conclusion

Regular database initialization checks, integrity verification, and reliable backup procedures help maintain the consistency and availability of the Campus Lost and Found Management System database.