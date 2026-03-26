from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


InteractionType = Literal["call", "email", "meeting"]
CallOutcome = Literal["interested", "not_interested", "follow_up"]


class InteractionCreate(BaseModel):
    interaction_type: InteractionType
    call_duration_minutes: int | None = Field(default=None, ge=0)
    call_outcome: CallOutcome | None = None
    email_sent: bool | None = None
    email_opened: bool | None = None
    email_replied: bool | None = None
    meeting_scheduled: bool | None = None
    meeting_completed: bool | None = None


class InteractionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    lead_id: str
    interaction_type: str
    payload: dict
    created_by_user_id: str
    created_at: datetime
