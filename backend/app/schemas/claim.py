from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, Field, ConfigDict


class ClaimCreate(BaseModel):
    item_id: int = Field(gt=0)
    claim_details: str = Field(min_length=10, max_length=2000)


class ClaimReview(BaseModel):
    claim_status: Literal["approved", "rejected"]
    admin_review: Optional[str] = Field(default=None, max_length=2000)


class ClaimResponse(BaseModel):
    claim_id: int
    item_id: int
    user_id: int
    claim_details: str
    claim_status: str
    admin_review: Optional[str]
    reviewed_by: Optional[int]
    claim_date: datetime
    reviewed_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)