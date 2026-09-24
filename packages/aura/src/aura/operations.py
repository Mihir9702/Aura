from datetime import datetime
from enum import StrEnum

from sqlalchemy import Boolean, Integer, String, select
from sqlalchemy.orm import Mapped, Session, mapped_column

from aura.common import Conflict
from aura.events import emit
from aura.storage import Base


class Action(StrEnum):
    ENTRY_INCREASE = "ENTRY_INCREASE"
    REDUCE_EXIT = "REDUCE_EXIT"


class Gate(Base):
    __tablename__ = "execution_gates"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    version: Mapped[int] = mapped_column(Integer, default=1)
    entry_halt: Mapped[bool] = mapped_column(Boolean, default=False)
    full_kill: Mapped[bool] = mapped_column(Boolean, default=False)


def locked_gate(session: Session) -> Gate:
    return session.scalars(select(Gate).where(Gate.id == "global").with_for_update()).one()


def change_control(
    session: Session, control: str, active: bool, expected: int, reason: str, command_id: str
) -> Gate:
    gate = locked_gate(session)
    if gate.version != expected:
        raise Conflict("Controls changed; refresh before trying again")
    if control not in {"entry_halt", "full_kill"}:
        raise ValueError("Unknown capability control")
    # Full Kill re-arm is intentionally unavailable until dependency/reconciliation
    # providers exist; clearing an Entry Halt cannot clear Full Kill.
    if control == "full_kill" and not active:
        raise Conflict("Re-arm requires healthy adapter/data and reconciliation; not configured")
    setattr(gate, control, active)
    gate.version += 1
    emit(
        session,
        control.upper() + "_CHANGED",
        "global",
        gate.version,
        command_id,
        {
            "active": active,
            "reason": reason,
            "actor": "owner",
            "cancellation_status": "NO_ADAPTER_CONFIGURED",
        },
    )
    return gate


def blocking_reasons(
    *,
    action: Action,
    mode: str,
    entry_halt: bool,
    full_kill: bool,
    permission: bool,
    health_expiry: dict[str, datetime],
    at: datetime,
    qualified: bool,
    policy_complete: bool,
) -> list[str]:
    reasons = []
    if mode == "OBSERVE":
        reasons.append("OBSERVE_MODE")
    elif mode not in {"ASSISTED_PAPER", "AUTONOMOUS_PAPER"}:
        reasons.append("UNKNOWN_MODE")
    if full_kill:
        reasons.append("FULL_KILL")
    if entry_halt and action == Action.ENTRY_INCREASE:
        reasons.append("ENTRY_HALT")
    if not permission:
        reasons.append("MISSING_PERMISSION")
    if not policy_complete:
        reasons.append("POLICY_INCOMPLETE")
    for dependency in ("market", "ledger", "adapter", "clock"):
        if dependency not in health_expiry or health_expiry[dependency] <= at:
            reasons.append("UNHEALTHY_" + dependency.upper())
    if action == Action.ENTRY_INCREASE and not qualified:
        reasons.append("STRATEGY_NOT_QUALIFIED")
    return reasons
