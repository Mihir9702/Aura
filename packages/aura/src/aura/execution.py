"""Isolated fixture adapter protocol; no vendor or active execution implementation."""

from typing import Protocol

from sqlalchemy.orm import Session

from aura.common import Conflict
from aura.ledger import FIXTURE_POLICY, FixtureOrder, fixture_portfolio
from aura.operations import locked_gate


class PaperAdapter(Protocol):
    def submit(self, client_order_id: str) -> str: ...
    def query(self, client_order_id: str) -> str | None: ...


def admit_fixture(session: Session, order_id: str) -> None:
    gate = locked_gate(session)
    order = session.get(FixtureOrder, order_id)
    if not order:
        raise Conflict("Unknown fixture order")
    fixture_portfolio(session, order.portfolio_id, FIXTURE_POLICY)
    if order.state != "AUTHORIZED":
        raise Conflict("Already attempted; reconcile rather than resubmit")
    if (
        gate.version != order.gate_version
        or gate.full_kill
        or (gate.entry_halt and order.side == "BUY")
    ):
        raise Conflict("Control state changed; new authorization required")
    order.state = "SUBMITTING"


def record_submission(session: Session, order_id: str, state: str) -> None:
    locked_gate(session)
    order = session.get(FixtureOrder, order_id)
    if not order or order.state not in {"SUBMITTING", "SUBMISSION_UNKNOWN"}:
        raise Conflict("Unexpected submission result")
    if state not in {"ACKNOWLEDGED", "SUBMISSION_UNKNOWN", "CANCELED"}:
        raise ValueError("Unsupported adapter result")
    order.state = state


def cancel_confirmed_fixture(session: Session, order_id: str) -> None:
    locked_gate(session)
    order = session.get(FixtureOrder, order_id)
    if not order or order.state == "FILLED":
        raise Conflict("No cancellable remainder")
    fixture_portfolio(session, order.portfolio_id, FIXTURE_POLICY)
    order.state = "CANCELED"
