from datetime import UTC, datetime
from decimal import Decimal


class Conflict(Exception):
    """A command conflicts with current state or a previously used identity."""


def now() -> datetime:
    return datetime.now(UTC)


def amount(value: str | Decimal) -> Decimal:
    result = Decimal(value)
    exponent = result.as_tuple().exponent
    if not result.is_finite() or not isinstance(exponent, int) or exponent < -8:
        raise ValueError("Amounts must be finite decimals with at most eight fractional places")
    if abs(result) >= Decimal("1000000000000"):
        raise ValueError("Amount exceeds foundation precision")
    return result
