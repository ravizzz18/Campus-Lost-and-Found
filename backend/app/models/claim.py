from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Claim(Base):
    __tablename__ = "claims"

    claim_id = Column(Integer, primary_key=True, index=True)

    item_id = Column(
        Integer,
        ForeignKey("items.item_id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    claim_details = Column(Text, nullable=False)

    claim_status = Column(
        String(20),
        nullable=False,
        default="pending"
    )

    admin_review = Column(Text, nullable=True)

    reviewed_by = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=True
    )

    claim_date = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    reviewed_at = Column(DateTime(timezone=True), nullable=True)