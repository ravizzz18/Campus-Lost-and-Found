from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

import os

DATABASE_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../database/campus_lost_found.db")
)

DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()