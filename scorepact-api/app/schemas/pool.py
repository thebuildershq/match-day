from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, Field


class PoolCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    competition_id: int
    competition_name: str = Field(..., min_length=1, max_length=100)


class PoolResponse(BaseModel):
    id: UUID
    slug: str
    name: str
    competition_id: int
    competition_name: str
    invite_code: str
    is_admin: bool
    member_count: int
    created_at: datetime

    model_config = {"from_attributes": True}


class PoolListItem(BaseModel):
    slug: str
    name: str
    competition_name: str
    is_admin: bool
    member_count: int
    your_rank: int
    your_points: int
    matchday_status: str
    recent_form: list[int | None]


class PoolMemberOut(BaseModel):
    id: UUID
    user_id: UUID
    name: str | None
    email: str
    role: str
    joined_at: datetime
    is_you: bool


class PoolDetail(BaseModel):
    id: UUID
    slug: str
    name: str
    competition_id: int
    competition_name: str
    invite_code: str
    is_admin: bool
    matchday: int
    your_points: int
    your_rank: int
    members: list[PoolMemberOut]
    created_at: datetime
