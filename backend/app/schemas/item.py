from datetime import datetime
from typing import Optional, Literal

from pydantic import BaseModel, Field, ConfigDict


class ItemCreate(BaseModel):
    item_name: str = Field(min_length=2, max_length=150)
    description: str = Field(min_length=5)
    category: str = Field(min_length=2, max_length=100)
    location: str = Field(min_length=2, max_length=200)

    report_type: Literal["Lost", "Found"] = "Lost"
    report_date: datetime

    image_path: Optional[str] = Field(
        default=None,
        max_length=500
    )


class ItemUpdate(BaseModel):
    item_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150
    )
    description: Optional[str] = Field(
        default=None,
        min_length=5
    )
    category: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )
    location: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=200
    )
    report_date: Optional[datetime] = None
    image_path: Optional[str] = Field(
        default=None,
        max_length=500
    )


class ItemResponse(BaseModel):
    item_id: int
    user_id: int
    item_name: str
    description: str
    category: str
    location: str
    report_type: str
    report_date: datetime
    image_path: Optional[str]
    status: str

    model_config = ConfigDict(from_attributes=True)