
import sqlite3
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
DATABASE_PATH = PROJECT_ROOT / "database" / "campus_lost_found.db"

EXPECTED_TABLES = {
    "users",
    "items",
    "claims",
    "revoked_tokens"
}


def verify_database():
    print("\nCAMPUS LOST AND FOUND - DATABASE VERIFICATION")
    print("=" * 50)

    if not DATABASE_PATH.exists():
        print(f"ERROR: Database not found: {DATABASE_PATH}")
        return False

    connection = sqlite3.connect(DATABASE_PATH)

    try:
        cursor = connection.cursor()

        cursor.execute("PRAGMA integrity_check")
        integrity = cursor.fetchone()[0]
        print(f"\nIntegrity Check: {integrity}")

        if integrity != "ok":
            return False

        cursor.execute("""
            SELECT name FROM sqlite_master
            WHERE type = 'table'
            AND name NOT LIKE 'sqlite_%'
        """)

        existing_tables = {row[0] for row in cursor.fetchall()}

        print("\nTABLE VERIFICATION")

        for table in sorted(EXPECTED_TABLES):
            status = "PASS" if table in existing_tables else "FAIL"
            print(f"[{status}] {table}")

        if EXPECTED_TABLES - existing_tables:
            return False

        print("\nPRIMARY KEY VERIFICATION")

        for table in sorted(EXPECTED_TABLES):
            cursor.execute(f'PRAGMA table_info("{table}")')
            columns = cursor.fetchall()
            primary_keys = [
                column[1] for column in columns if column[5] > 0
            ]

            if not primary_keys:
                print(f"[FAIL] {table}: No primary key")
                return False

            print(f"[PASS] {table}: {', '.join(primary_keys)}")

        print("\nFOREIGN KEY VERIFICATION")

        for table in ("items", "claims"):
            cursor.execute(f'PRAGMA foreign_key_list("{table}")')
            foreign_keys = cursor.fetchall()

            if not foreign_keys:
                print(f"[FAIL] {table}: No foreign keys")
                return False

            print(f"[PASS] {table}: {len(foreign_keys)} foreign key(s)")

        print("\n" + "=" * 50)
        print("DATABASE VERIFICATION COMPLETED SUCCESSFULLY")
        return True

    except sqlite3.Error as error:
        print(f"Database error: {error}")
        return False

    finally:
        connection.close()


if __name__ == "__main__":
    sys.exit(0 if verify_database() else 1)
