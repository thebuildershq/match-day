from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.db import get_db
from app.auth.clerk import CurrentUser
from app.models import Pool, PoolMembership
from app.schemas.pool import PoolCreate, PoolResponse, PoolListItem, PoolDetail, PoolMemberOut
from app.utils.slug import generate_unique_slug, generate_invite_code

router = APIRouter(prefix="/pools", tags=["pools"])


@router.post("", response_model=PoolResponse, status_code=status.HTTP_201_CREATED)
def create_pool(payload: PoolCreate, user: CurrentUser, db: Session = Depends(get_db)):
    slug = generate_unique_slug(db, payload.name)
    invite_code = generate_invite_code()

    pool = Pool(
        slug=slug,
        name=payload.name,
        competition_id=payload.competition_id,
        competition_name=payload.competition_name,
        admin_user_id=user.id,
        invite_code=invite_code,
    )
    db.add(pool)
    db.flush()  # populate pool.id before referencing it

    membership = PoolMembership(pool_id=pool.id, user_id=user.id, role="admin")
    db.add(membership)
    db.commit()
    db.refresh(pool)

    return PoolResponse(
        id=pool.id,
        slug=pool.slug,
        name=pool.name,
        competition_id=pool.competition_id,
        competition_name=pool.competition_name,
        invite_code=pool.invite_code,
        is_admin=True,
        member_count=1,
        created_at=pool.created_at,
    )




@router.get("", response_model=list[PoolListItem])
def list_pools(user: CurrentUser, db: Session = Depends(get_db)):
    pools = (
        db.query(Pool)
        .join(PoolMembership, PoolMembership.pool_id == Pool.id)
        .filter(PoolMembership.user_id == user.id)
        .order_by(Pool.created_at.desc())
        .all()
    )

    result = []
    for pool in pools:
        member_count = (
            db.query(PoolMembership).filter(PoolMembership.pool_id == pool.id).count()
        )
        result.append(
            PoolListItem(
                slug=pool.slug,
                name=pool.name,
                competition_name=pool.competition_name,
                is_admin=pool.admin_user_id == user.id,
                member_count=member_count,
                your_rank=1,
                your_points=0,
                matchday_status="no-fixtures",
                recent_form=[],
            )
        )

    return result





@router.get("/{slug}", response_model=PoolDetail)
def get_pool(slug: str, user: CurrentUser, db: Session = Depends(get_db)):
    pool = db.query(Pool).filter(Pool.slug == slug).first()
    if not pool:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pool not found")

    is_member = (
        db.query(PoolMembership)
        .filter(PoolMembership.pool_id == pool.id, PoolMembership.user_id == user.id)
        .first()
    )
    if not is_member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not a member of this pool")

    memberships = (
        db.query(PoolMembership)
        .options(joinedload(PoolMembership.user))
        .filter(PoolMembership.pool_id == pool.id)
        .order_by(PoolMembership.joined_at.asc())
        .all()
    )

    members = [
        PoolMemberOut(
            id=m.id,
            user_id=m.user.id,
            name=m.user.name,
            email=m.user.email,
            role=m.role,
            joined_at=m.joined_at,
            is_you=m.user.id == user.id,
        )
        for m in memberships
    ]

    return PoolDetail(
        id=pool.id,
        slug=pool.slug,
        name=pool.name,
        competition_id=pool.competition_id,
        competition_name=pool.competition_name,
        invite_code=pool.invite_code,
        is_admin=pool.admin_user_id == user.id,
        matchday=0,
        your_points=0,
        your_rank=1,
        members=members,
        created_at=pool.created_at,
    )
