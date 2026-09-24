from dataclasses import dataclass
from enum import StrEnum


class Status(StrEnum):
    DEVELOPMENT = "DEVELOPMENT"
    BACKTESTING = "BACKTESTING"
    PAPER_SHADOW = "PAPER_SHADOW"
    QUALIFIED = "QUALIFIED"
    ACTIVE_PAPER = "ACTIVE_PAPER"
    SUSPENDED = "SUSPENDED"


@dataclass(frozen=True)
class Pod:
    id: str
    name: str
    description: str
    status: Status = Status.DEVELOPMENT
    implementation: str = "UNIMPLEMENTED"


PODS = (
    Pod("momentum", "Momentum", "Persistence in price and relative strength."),
    Pod("breakout", "Breakout", "Expansion beyond a defined price range."),
    Pod("event-catalyst", "Event / Catalyst", "Price discovery around material events."),
    Pod("mean-reversion", "Mean Reversion", "Dislocations from a defined reference."),
    Pod("swing-trend", "Swing Trend", "Multi-session trends with explicit invalidation."),
)


def validate_transition(
    previous: Status, target: Status, *, evidence: bool, human_approval: bool
) -> None:
    next_state = {
        Status.DEVELOPMENT: Status.BACKTESTING,
        Status.BACKTESTING: Status.PAPER_SHADOW,
        Status.PAPER_SHADOW: Status.QUALIFIED,
        Status.QUALIFIED: Status.ACTIVE_PAPER,
    }
    if target == Status.SUSPENDED:
        return
    if next_state.get(previous) != target:
        raise ValueError(
            "Unsupported lifecycle transition; resume requires reviewed requalification"
        )
    if target in {Status.QUALIFIED, Status.ACTIVE_PAPER} and not (evidence and human_approval):
        raise ValueError("Evidence and human approval are required")
