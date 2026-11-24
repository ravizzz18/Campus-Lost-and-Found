from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth.security import get_current_user
from app.models.user import User
from app.models.item import Item
from app.models.claim import Claim
from app.schemas.claim import ClaimCreate, ClaimReview, ClaimResponse


router = APIRouter(
    prefix="/api/claims",
    tags=["Claim Management"]
)


# 1. Submit a claim for a found item
@router.post(
    "",
    response_model=ClaimResponse,
    status_code=status.HTTP_201_CREATED
)
def create_claim(
    claim_data: ClaimCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    item = db.query(Item).filter(
        Item.item_id == claim_data.item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )

    if item.report_type != "Found":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Claims can only be submitted for found items"
        )

    if item.status != "active":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This item is no longer available for claims"
        )

    if item.user_id == current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot claim an item you reported"
        )

    existing_claim = db.query(Claim).filter(
        Claim.item_id == claim_data.item_id,
        Claim.user_id == current_user.user_id,
        Claim.claim_status == "pending"
    ).first()

    if existing_claim:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a pending claim for this item"
        )

    new_claim = Claim(
        item_id=claim_data.item_id,
        user_id=current_user.user_id,
        claim_details=claim_data.claim_details,
        claim_status="pending"
    )

    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)

    return new_claim


# 2. Retrieve claims
@router.get("", response_model=list[ClaimResponse])
def get_claims(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Claim)

    if current_user.role != "admin":
        query = query.filter(
            Claim.user_id == current_user.user_id
        )

    return query.order_by(Claim.claim_date.desc()).all()


# 3. Retrieve a specific claim
@router.get("/{claim_id}", response_model=ClaimResponse)
def get_claim(
    claim_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    claim = db.query(Claim).filter(
        Claim.claim_id == claim_id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found"
        )

    if (
        current_user.role != "admin"
        and claim.user_id != current_user.user_id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this claim"
        )

    return claim


# 4. Approve or reject a claim (Admin only)
@router.patch("/{claim_id}/review", response_model=ClaimResponse)
def review_claim(
    claim_id: int,
    review_data: ClaimReview,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can review claims"
        )

    claim = db.query(Claim).filter(
        Claim.claim_id == claim_id
    ).first()

    if not claim:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Claim not found"
        )

    if claim.claim_status != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This claim has already been reviewed"
        )

    item = db.query(Item).filter(
        Item.item_id == claim.item_id
    ).first()

    if not item or item.report_type != "Found" or item.status != "active":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This item is no longer available for review"
        )

    review_time = datetime.now(timezone.utc)

    claim.claim_status = review_data.claim_status
    claim.admin_review = review_data.admin_review
    claim.reviewed_by = current_user.user_id
    claim.reviewed_at = review_time

    if review_data.claim_status == "approved":
        item.status = "resolved"

        # Reject other pending claims for the same item
        other_claims = db.query(Claim).filter(
            Claim.item_id == item.item_id,
            Claim.claim_id != claim.claim_id,
            Claim.claim_status == "pending"
        ).all()

        for other_claim in other_claims:
            other_claim.claim_status = "rejected"
            other_claim.admin_review = (
                "Another claim was approved for this item."
            )
            other_claim.reviewed_by = current_user.user_id
            other_claim.reviewed_at = review_time

    db.commit()
    db.refresh(claim)

    return claim