import os
import sys

# Add backend directory to Python path
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../..")
)

BACKEND_PATH = os.path.join(PROJECT_ROOT, "backend")

sys.path.insert(0, BACKEND_PATH)

# Import database configuration
from app.database import Base, engine

# Import all database models
from app.models.user import User
from app.models.item import Item
from app.models.claim import Claim
from app.models.revoked_token import RevokedToken


def initialize_database():
    print("Initializing Campus Lost and Found Database...")

    Base.metadata.create_all(bind=engine)

    print("Database initialized successfully!")
    print("Tables created or verified:")

    for table in Base.metadata.sorted_tables:
        print(f"- {table.name}")


if __name__ == "__main__":
    initialize_database()