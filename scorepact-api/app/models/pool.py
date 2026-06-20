import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, DateTime, Integer, ForeignKey, UUID, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.prediction import Prediction


class Pool(Base):
    __tablename__ = "pools"

    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String, unique=True, index=True)
    name: Mapped[str] = mapped_column(String)
    competition_id: Mapped[int] = mapped_column(Integer)
    competition_name: Mapped[str] = mapped_column(String)
    admin_user_id: Mapped[uuid.UUID] = mapped_column(UUID, ForeignKey("users.id"))
    invite_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    admin: Mapped["User"] = relationship(foreign_keys=[admin_user_id])
    memberships: Mapped[list["PoolMembership"]] = relationship(
        back_populates="pool", cascade="all, delete-orphan"
    )
    predictions: Mapped[list["Prediction"]] = relationship(
        back_populates="pool", cascade="all, delete-orphan"
    )


class PoolMembership(Base):
    __tablename__ = "pool_memberships"
    __table_args__ = (UniqueConstraint("pool_id", "user_id", name="uq_pool_user"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID, primary_key=True, default=uuid.uuid4)
    pool_id: Mapped[uuid.UUID] = mapped_column(UUID, ForeignKey("pools.id", ondelete="CASCADE"))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID, ForeignKey("users.id", ondelete="CASCADE"))
    role: Mapped[str] = mapped_column(String, default="member")
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    pool: Mapped["Pool"] = relationship(back_populates="memberships")
    user: Mapped["User"] = relationship(back_populates="memberships")
