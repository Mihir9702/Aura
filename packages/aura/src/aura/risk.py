"""Deterministic capacity sizing primitive; no approved investment limits or routing.

Callers supply validated, version-bound state and explicit limits. This primitive
cannot grant an execution authorization or replace the full Risk Engine ruleset.
"""

from dataclasses import dataclass
from decimal import ROUND_DOWN, Decimal
from typing import Literal

from aura.common import amount


@dataclass(frozen=True)
class SizingDecision:
    outcome: Literal["APPROVE", "RESIZE", "REJECT"]
    requested: Decimal
    allowed: Decimal
    reason: str


def size_entry(
    *,
    requested: Decimal,
    price_bound: Decimal,
    fee_budget: Decimal,
    available_cash: Decimal,
    explicit_notional_limit: Decimal,
    quantity_increment: Decimal,
    fractional_supported: bool,
) -> SizingDecision:
    requested, price_bound, fee_budget, available_cash, explicit_notional_limit, step = map(
        amount,
        (
            requested,
            price_bound,
            fee_budget,
            available_cash,
            explicit_notional_limit,
            quantity_increment,
        ),
    )
    if min(requested, price_bound, step) <= 0 or fee_budget < 0:
        raise ValueError("Positive quantity, price, increment and nonnegative fee required")
    if not fractional_supported:
        if step % 1:
            raise ValueError("Nonfractional capability must declare a whole-share increment")
    capacity = min(available_cash - fee_budget, explicit_notional_limit)
    permitted = min(requested, max(Decimal(0), capacity) / price_bound)
    allowed = (permitted / step).to_integral_value(rounding=ROUND_DOWN) * step
    if allowed <= 0:
        return SizingDecision("REJECT", requested, Decimal(0), "NO_ADMISSIBLE_CAPACITY")
    return SizingDecision(
        "APPROVE" if allowed == requested else "RESIZE",
        requested,
        allowed,
        "WITHIN_EXPLICIT_CAPACITY",
    )
