"""Temporal input validation; no unapproved regime classifier or thresholds."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, field_validator


class Observation(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")
    id: str
    event_time: datetime
    available_at: datetime
    value: Decimal

    @field_validator("event_time", "available_at")
    @classmethod
    def aware(cls, value: datetime) -> datetime:
        if value.tzinfo is None:
            raise ValueError("Timezone-aware timestamps required")
        return value

    @field_validator("value")
    @classmethod
    def finite(cls, value: Decimal) -> Decimal:
        if not value.is_finite():
            raise ValueError("Finite observations required")
        return value


def eligible(
    observations: list[Observation], as_of: datetime, knowledge_cutoff: datetime
) -> tuple[Observation, ...]:
    if as_of.tzinfo is None or knowledge_cutoff.tzinfo is None:
        raise ValueError("Timezone-aware cutoffs required")
    return tuple(
        sorted(
            (
                o
                for o in observations
                if o.event_time <= as_of and o.available_at <= knowledge_cutoff
            ),
            key=lambda o: o.id,
        )
    )
