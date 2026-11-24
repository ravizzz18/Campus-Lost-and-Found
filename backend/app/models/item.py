from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Item(Base):
    __tablename__ = "items"

    item_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    item_name = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    location = Column(String(200), nullable=False)

    report_type = Column(String(20), nullable=False, default="Lost")
    report_date = Column(DateTime(timezone=True), nullable=False)

    image_path = Column(String(500), nullable=True)

    status = Column(String(30), nullable=False, default="active")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )