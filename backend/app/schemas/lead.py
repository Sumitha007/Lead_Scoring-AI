from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


LeadCategory = Literal["student", "employed", "business", "freelancer", "other"]


class LeadCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    phone: str = Field(min_length=7, max_length=32)
    category: LeadCategory = "other"
    company: str | None = None
    budget: float | None = None
    website_visits: int = 0
    time_spent_seconds: int = 0
    clicks: int = 0
    pages_visited: int = 0
    add_to_cart: int = 0
    product_views: int = 0


class LeadUpdateWebsiteData(BaseModel):
    website_visits: int
    time_spent_seconds: int
    clicks: int
    pages_visited: int
    add_to_cart: int
    product_views: int


class LeadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    email: str
    phone: str
    category: str
    company: str | None
    budget: float | None
    website_visits: int
    time_spent_seconds: int
    clicks: int
    pages_visited: int
    add_to_cart: int
    product_views: int
    created_at: datetime
    updated_at: datetime


class LeadWithScoreOut(LeadOut):
    score: float = 0.0
    recommendation: str = "Nurture later"
    priority: Literal["high", "medium", "low"] = "low"
