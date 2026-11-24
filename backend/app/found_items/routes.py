
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.item import Item
from app.models.user import User
from app.schemas.item import ItemCreate, ItemUpdate, ItemResponse
from app.auth.security import get_current_user

router = APIRouter(
    prefix="/api/found-items",
    tags=["Found Item Management"]
)


# 1. Report a found item
@router.post(
    "",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED
)
def create_found_item(
    item_data: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if item_data.report_type != "Found":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This endpoint only accepts found item reports"
        )

    item_values = item_data.model_dump()
    item_values["user_id"] = current_user.user_id
    item_values["report_type"] = "Found"
    item_values["status"] = "active"

    new_item = Item(**item_values)

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


# 2. Retrieve all found items
@router.get("", response_model=list[ItemResponse])
def get_found_items(
    db: Session = Depends(get_db)
):
    return db.query(Item).filter(
        Item.report_type == "Found"
    ).order_by(
        Item.created_at.desc()
    ).all()


# 3. Search found items
@router.get("/search", response_model=list[ItemResponse])
def search_found_items(
    keyword: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    search_term = f"%{keyword.strip()}%"

    return db.query(Item).filter(
        Item.report_type == "Found",
        (
            Item.item_name.ilike(search_term) |
            Item.description.ilike(search_term) |
            Item.category.ilike(search_term) |
            Item.location.ilike(search_term)
        )
    ).order_by(Item.created_at.desc()).all()


# 4. Filter found items
@router.get("/filter", response_model=list[ItemResponse])
def filter_found_items(
    category: str | None = None,
    location: str | None = None,
    item_status: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(Item).filter(
        Item.report_type == "Found"
    )

    if category:
        query = query.filter(
            Item.category.ilike(f"%{category}%")
        )

    if location:
        query = query.filter(
            Item.location.ilike(f"%{location}%")
        )

    if item_status:
        query = query.filter(
            Item.status.ilike(item_status)
        )

    return query.order_by(Item.created_at.desc()).all()


# 5. Retrieve a specific found item
@router.get("/{item_id}", response_model=ItemResponse)
def get_found_item(
    item_id: int,
    db: Session = Depends(get_db)
):
    item = db.query(Item).filter(
        Item.item_id == item_id,
        Item.report_type == "Found"
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Found item not found"
        )

    return item


# 6. Update a found item report
@router.put("/{item_id}", response_model=ItemResponse)
def update_found_item(
    item_id: int,
    item_data: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Item).filter(
        Item.item_id == item_id,
        Item.report_type == "Found"
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Found item not found"
        )

    if (
        item.user_id != current_user.user_id
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to update this report"
        )

    update_data = item_data.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(item, key, value)

    db.commit()
    db.refresh(item)

    return item


# 7. Delete a found item report
@router.delete(
    "/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_found_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Item).filter(
        Item.item_id == item_id,
        Item.report_type == "Found"
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Found item not found"
        )

    if (
        item.user_id != current_user.user_id
        and current_user.role != "admin"
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this report"
        )

    db.delete(item)
    db.commit()

    return None
