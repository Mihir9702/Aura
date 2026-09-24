from datetime import UTC, datetime, timedelta
from decimal import Decimal

import pytest
from aura.common import amount
from aura.operations import Action, blocking_reasons
from aura.regime import Observation, eligible
from aura.risk import size_entry
from aura.strategies import PODS, Status, validate_transition


@pytest.mark.parametrize("value", ["NaN", "Infinity", "-Infinity", "0.000000001"])
def test_reject_unsafe_decimal(value):
    with pytest.raises(ValueError):
        amount(value)


def test_fractional_amount_is_exact():
    assert amount("0.75") * amount("110") == Decimal("82.50")


def test_capacity_sizing_never_rounds_up_or_borrows():
    decision = size_entry(
        requested=Decimal("5"),
        price_bound=Decimal("100"),
        fee_budget=Decimal("1"),
        available_cash=Decimal("500"),
        explicit_notional_limit=Decimal("500"),
        quantity_increment=Decimal("1"),
        fractional_supported=False,
    )
    assert decision.outcome == "RESIZE"
    assert decision.allowed == 4
    no_capacity = size_entry(
        requested=Decimal(".5"),
        price_bound=Decimal("100"),
        fee_budget=Decimal("1"),
        available_cash=Decimal("50"),
        explicit_notional_limit=Decimal("500"),
        quantity_increment=Decimal("1"),
        fractional_supported=False,
    )
    assert no_capacity.outcome == "REJECT"


def test_qualification_is_not_implementation():
    assert len(PODS) == 5
    assert all(p.implementation == "UNIMPLEMENTED" for p in PODS)
    with pytest.raises(ValueError):
        validate_transition(
            Status.DEVELOPMENT, Status.ACTIVE_PAPER, evidence=True, human_approval=True
        )
    with pytest.raises(ValueError):
        validate_transition(
            Status.PAPER_SHADOW, Status.QUALIFIED, evidence=True, human_approval=False
        )


@pytest.mark.parametrize(
    "action,halt,kill,mode,blocked",
    [
        (Action.ENTRY_INCREASE, True, False, "AUTONOMOUS_PAPER", True),
        (Action.REDUCE_EXIT, True, False, "ASSISTED_PAPER", False),
        (Action.REDUCE_EXIT, False, True, "ASSISTED_PAPER", True),
        (Action.REDUCE_EXIT, True, False, "OBSERVE", True),
    ],
)
def test_capabilities_intersect(action, halt, kill, mode, blocked):
    at = datetime.now(UTC)
    reasons = blocking_reasons(
        action=action,
        mode=mode,
        entry_halt=halt,
        full_kill=kill,
        permission=True,
        health_expiry={
            k: at + timedelta(seconds=10) for k in ["market", "ledger", "adapter", "clock"]
        },
        at=at,
        qualified=action == Action.ENTRY_INCREASE,
        policy_complete=True,
    )
    assert bool(reasons) is blocked


def test_missing_health_blocks_exit_even_with_permission():
    reasons = blocking_reasons(
        action=Action.REDUCE_EXIT,
        mode="ASSISTED_PAPER",
        entry_halt=True,
        full_kill=False,
        permission=True,
        health_expiry={},
        at=datetime.now(UTC),
        qualified=False,
        policy_complete=True,
    )
    assert "UNHEALTHY_LEDGER" in reasons
    assert "STRATEGY_NOT_QUALIFIED" not in reasons


def test_temporal_revisions_are_not_backdated():
    at = datetime(2026, 1, 1, tzinfo=UTC)
    original = Observation(id="old", event_time=at, available_at=at, value="1")
    revision = Observation(
        id="revised", event_time=at, available_at=at + timedelta(days=1), value="9"
    )
    assert eligible([revision, original], at, at) == (original,)
