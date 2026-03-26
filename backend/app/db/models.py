from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserRole(str, enum.Enum):
    admin = "admin"
    employee = "employee"


class Category(str, enum.Enum):
    student = "student"
    employed = "employed"
    business = "business"
    freelancer = "freelancer"
    other = "other"


class InteractionType(str, enum.Enum):
    call = "call"
    email = "email"
    meeting = "meeting"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.employee, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(32), nullable=False)
    category: Mapped[Category] = mapped_column(Enum(Category), default=Category.other, nullable=False)
    company: Mapped[str | None] = mapped_column(String(255), nullable=True)
    budget: Mapped[float | None] = mapped_column(Float, nullable=True)
    website_visits: Mapped[int] = mapped_column(Integer, default=0)
    # User behavior tracking fields
    time_spent_seconds: Mapped[int] = mapped_column(Integer, default=0)  # time user spends on website in seconds
    clicks: Mapped[int] = mapped_column(Integer, default=0)  # total number of clicks
    pages_visited: Mapped[int] = mapped_column(Integer, default=0)  # count pages visited
    add_to_cart: Mapped[int] = mapped_column(Integer, default=0)  # 0 or 1
    product_views: Mapped[int] = mapped_column(Integer, default=0)  # count
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    interactions: Mapped[list[Interaction]] = relationship(back_populates="lead", cascade="all, delete-orphan")
    score: Mapped[Score | None] = relationship(back_populates="lead", cascade="all, delete-orphan", uselist=False)


class Interaction(Base):
    __tablename__ = "interactions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lead_id: Mapped[str] = mapped_column(String(36), ForeignKey("leads.id", ondelete="CASCADE"), index=True)
    interaction_type: Mapped[InteractionType] = mapped_column(Enum(InteractionType), nullable=False)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    created_by_user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    lead: Mapped[Lead] = relationship(back_populates="interactions")


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    lead_id: Mapped[str] = mapped_column(String(36), ForeignKey("leads.id", ondelete="CASCADE"), unique=True, index=True)
    score_probability: Mapped[float] = mapped_column(Float, nullable=False)
    recommendation: Mapped[str] = mapped_column(String(120), nullable=False)
    explanation_json: Mapped[dict] = mapped_column(JSON, default=dict)
    model_version: Mapped[str] = mapped_column(String(40), default="rf-v1")
    summary: Mapped[str] = mapped_column(Text, default="")
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lead: Mapped[Lead] = relationship(back_populates="score")
