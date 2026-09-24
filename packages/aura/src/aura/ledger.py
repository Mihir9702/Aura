"""Canonical journals and isolated M1 fixture accounting.

The fixture execution API rejects ACTIVE_PAPER portfolios. FIFO, fee-expensing
and immediate settlement are explicit test assumptions, not production defaults.
"""

from decimal import Decimal
from typing import Any
from uuid import uuid4

from sqlalchemy import CheckConstraint, ForeignKey, Integer, Numeric, String, select
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, Session, mapped_column

from aura.common import Conflict, amount
from aura.events import emit
from aura.operations import locked_gate
from aura.storage import Base

ZERO = Decimal("0")
FIXTURE_POLICY = "FIFO_FEE_EXPENSE_IMMEDIATE_V1"


class Portfolio(Base):
    __tablename__ = "portfolios"
    __table_args__ = (CheckConstraint("environment IN ('ACTIVE_PAPER', 'SHADOW')"),)
    id: Mapped[str] = mapped_column(String, primary_key=True)
    environment: Mapped[str] = mapped_column(String)
    version: Mapped[int] = mapped_column(Integer, default=1)
    capital: Mapped[Decimal] = mapped_column(Numeric(28, 8))


class Journal(Base):
    __tablename__ = "journals"
    id: Mapped[str] = mapped_column(String, primary_key=True)
    portfolio_id: Mapped[str] = mapped_column(ForeignKey("portfolios.id"))
    source_key: Mapped[str] = mapped_column(String, unique=True)
    facts: Mapped[dict[str, Any]] = mapped_column(JSONB)


class Posting(Base):
    __tablename__ = "postings"
    __table_args__ = (CheckConstraint("amount <> 0"),)
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    journal_id: Mapped[str] = mapped_column(ForeignKey("journals.id"))
    account: Mapped[str] = mapped_column(String)
    amount: Mapped[Decimal] = mapped_column(Numeric(28, 8))  # debit positive / credit negative


class Lot(Base):
    __tablename__ = "lots"
    __table_args__ = (CheckConstraint("quantity >= 0 AND basis >= 0"),)
    id: Mapped[str] = mapped_column(String, primary_key=True)
    ordinal: Mapped[int] = mapped_column(Integer)
    portfolio_id: Mapped[str] = mapped_column(ForeignKey("portfolios.id"))
    instrument: Mapped[str] = mapped_column(String)
    strategy_scope: Mapped[str] = mapped_column(String)
    quantity: Mapped[Decimal] = mapped_column(Numeric(28, 8))
    basis: Mapped[Decimal] = mapped_column(Numeric(28, 8))


class FixtureOrder(Base):
    __tablename__ = "fixture_orders"
    __table_args__ = (CheckConstraint("quantity > 0 AND filled >= 0 AND filled <= quantity"),)
    id: Mapped[str] = mapped_column(String, primary_key=True)
    portfolio_id: Mapped[str] = mapped_column(ForeignKey("portfolios.id"))
    instrument: Mapped[str] = mapped_column(String)
    strategy_scope: Mapped[str] = mapped_column(String)
    side: Mapped[str] = mapped_column(String)
    quantity: Mapped[Decimal] = mapped_column(Numeric(28, 8))
    filled: Mapped[Decimal] = mapped_column(Numeric(28, 8), default=ZERO)
    price_bound: Mapped[Decimal] = mapped_column(Numeric(28, 8))
    fee_budget: Mapped[Decimal] = mapped_column(Numeric(28, 8))
    fees_paid: Mapped[Decimal] = mapped_column(Numeric(28, 8), default=ZERO)
    state: Mapped[str] = mapped_column(String, default="AUTHORIZED")
    gate_version: Mapped[int] = mapped_column(Integer)


def balances(session: Session, portfolio_id: str) -> dict[str, Decimal]:
    totals: dict[str, Decimal] = {}
    rows = session.execute(
        select(Posting.account, Posting.amount)
        .join(Journal)
        .where(Journal.portfolio_id == portfolio_id)
    ).all()
    for account, value in rows:
        totals[account] = totals.get(account, ZERO) + value
    return totals


def post(
    session: Session,
    portfolio: Portfolio,
    source: str,
    facts: dict[str, Any],
    entries: dict[str, Decimal],
) -> None:
    entries = {key: amount(value) for key, value in entries.items() if value != ZERO}
    if sum(entries.values(), ZERO) != ZERO or not entries:
        raise ValueError("Unbalanced or empty journal")
    journal_id = str(uuid4())
    session.add(Journal(id=journal_id, portfolio_id=portfolio.id, source_key=source, facts=facts))
    session.flush()
    for account, value in entries.items():
        session.add(Posting(journal_id=journal_id, account=account, amount=value))
    portfolio.version += 1
    emit(
        session,
        "LEDGER_POSTED",
        portfolio.id,
        portfolio.version,
        source,
        {"journal_id": journal_id, "source": source},
    )
    session.flush()


def fund(
    session: Session,
    portfolio_id: str,
    capital: Decimal = Decimal("500.00"),
    environment: str = "ACTIVE_PAPER",
) -> Portfolio:
    locked_gate(session)
    capital = amount(capital)
    if capital <= 0 or environment not in {"ACTIVE_PAPER", "SHADOW"}:
        raise ValueError("Invalid challenge funding")
    if environment == "ACTIVE_PAPER" and (capital != Decimal("500") or portfolio_id != "challenge"):
        raise ValueError("Initial active challenge funding is exactly 500.00 USD")
    existing = session.get(Portfolio, portfolio_id)
    if existing:
        if existing.capital != capital or existing.environment != environment:
            raise Conflict("Funding identity already used with different capital/environment")
        return existing
    portfolio = Portfolio(id=portfolio_id, capital=capital, environment=environment, version=1)
    session.add(portfolio)
    session.flush()
    post(
        session,
        portfolio,
        f"fund:{portfolio_id}",
        {"kind": "FUNDING", "capital": str(capital)},
        {"cash": capital, "capital": -capital},
    )
    return portfolio


def fixture_portfolio(session: Session, portfolio_id: str, policy: str) -> Portfolio:
    locked_gate(session)
    portfolio = session.get(Portfolio, portfolio_id)
    if not portfolio or portfolio.environment != "SHADOW" or policy != FIXTURE_POLICY:
        raise Conflict(
            "Fixture accounting requires an isolated SHADOW portfolio and explicit policy"
        )
    return portfolio


def reserve_fixture(
    session: Session,
    *,
    portfolio_id: str,
    order_id: str,
    instrument: str,
    scope: str,
    side: str,
    quantity: Decimal,
    price_bound: Decimal,
    fee_budget: Decimal,
    increment: Decimal,
    fractional_supported: bool,
    policy: str,
) -> FixtureOrder:
    portfolio = fixture_portfolio(session, portfolio_id, policy)
    gate = locked_gate(session)
    quantity, price_bound, fee_budget, increment = map(
        amount, (quantity, price_bound, fee_budget, increment)
    )
    if side not in {"BUY", "SELL"} or min(quantity, price_bound, increment) <= 0 or fee_budget < 0:
        raise ValueError("Invalid long-only fixture order")
    if quantity % increment or (not fractional_supported and quantity % 1):
        raise Conflict("Unsupported fractional quantity or increment")
    existing = session.get(FixtureOrder, order_id)
    if existing:
        if (
            existing.portfolio_id,
            existing.instrument,
            existing.strategy_scope,
            existing.side,
            existing.quantity,
            existing.price_bound,
            existing.fee_budget,
        ) != (portfolio_id, instrument, scope, side, quantity, price_bound, fee_budget):
            raise Conflict("Order identity reused with different intent")
        return existing
    if gate.full_kill or (gate.entry_halt and side == "BUY"):
        raise Conflict("Capability control blocks order")
    pending = session.scalars(
        select(FixtureOrder).where(
            FixtureOrder.portfolio_id == portfolio_id,
            FixtureOrder.state.not_in(["CANCELED", "FILLED"]),
        )
    ).all()
    if side == "BUY":
        reserved = sum(
            (
                (o.quantity - o.filled) * o.price_bound + o.fee_budget - o.fees_paid
                for o in pending
                if o.side == "BUY"
            ),
            ZERO,
        )
        if (
            quantity * price_bound + fee_budget
            > balances(session, portfolio_id).get("cash", ZERO) - reserved
        ):
            raise Conflict("Insufficient shared cash including pending reservations")
    else:
        held = sum(
            (
                lot.quantity
                for lot in session.scalars(
                    select(Lot).where(
                        Lot.portfolio_id == portfolio_id,
                        Lot.instrument == instrument,
                        Lot.strategy_scope == scope,
                    )
                )
            ),
            ZERO,
        )
        reserved = sum(
            (
                o.quantity - o.filled
                for o in pending
                if o.side == "SELL" and o.instrument == instrument and o.strategy_scope == scope
            ),
            ZERO,
        )
        if quantity > held - reserved:
            raise Conflict("Exit would oversell owned unreserved strategy lots")
        if quantity * price_bound < fee_budget:
            raise Conflict("Fee budget could require additional cash for exit")
    order = FixtureOrder(
        id=order_id,
        portfolio_id=portfolio_id,
        instrument=instrument,
        strategy_scope=scope,
        side=side,
        quantity=quantity,
        price_bound=price_bound,
        fee_budget=fee_budget,
        filled=ZERO,
        fees_paid=ZERO,
        state="AUTHORIZED",
        gate_version=gate.version,
    )
    session.add(order)
    portfolio.version += 1
    emit(
        session,
        "FIXTURE_ORDER_RESERVED",
        portfolio_id,
        portfolio.version,
        order_id,
        {"order_id": order_id, "environment": "SHADOW"},
    )
    session.flush()
    return order


def apply_fixture_fill(
    session: Session,
    *,
    order_id: str,
    execution_id: str,
    quantity: Decimal,
    price: Decimal,
    fee: Decimal,
    policy: str,
) -> None:
    locked_gate(session)
    order = session.get(FixtureOrder, order_id)
    if not order:
        raise Conflict("Orphan execution; reconciliation required")
    portfolio = fixture_portfolio(session, order.portfolio_id, policy)
    quantity, price, fee = map(amount, (quantity, price, fee))
    facts = {
        "kind": "FILL",
        "order_id": order_id,
        "quantity": str(quantity),
        "price": str(price),
        "fee": str(fee),
        "policy": policy,
    }
    source = "fixture-fill:" + execution_id
    previous = session.scalars(select(Journal).where(Journal.source_key == source)).first()
    if previous:
        if previous.facts != facts:
            raise Conflict("Execution identity reused with conflicting facts")
        return
    if quantity <= 0 or price <= 0 or fee < 0 or order.filled + quantity > order.quantity:
        raise Conflict("Invalid fill quantity/price/fee")
    if order.fees_paid + fee > order.fee_budget:
        raise Conflict("Fixture fee assumption exceeded; reconciliation required")
    if (order.side == "BUY" and price > order.price_bound) or (
        order.side == "SELL" and price < order.price_bound
    ):
        raise Conflict("Fixture execution outside authorized price bound")
    # This is a receipt, not a new submission: Full Kill must not prevent posting.
    value = amount(quantity * price)
    if order.side == "BUY":
        if value + fee > balances(session, portfolio.id).get("cash", ZERO):
            raise Conflict("Execution creates negative cash; reconciliation required")
        session.add(
            Lot(
                id=execution_id,
                ordinal=portfolio.version,
                portfolio_id=portfolio.id,
                instrument=order.instrument,
                strategy_scope=order.strategy_scope,
                quantity=quantity,
                basis=value,
            )
        )
        entries = {"cash": -(value + fee), "security_cost": value, "fees": fee}
    else:
        lots = session.scalars(
            select(Lot)
            .where(
                Lot.portfolio_id == portfolio.id,
                Lot.instrument == order.instrument,
                Lot.strategy_scope == order.strategy_scope,
                Lot.quantity > 0,
            )
            .order_by(Lot.ordinal, Lot.id)
        ).all()
        remaining, basis = quantity, ZERO
        for lot in lots:
            take = min(remaining, lot.quantity)
            removed_basis = (
                lot.basis
                if take == lot.quantity
                else (lot.basis * take / lot.quantity).quantize(Decimal("0.00000001"))
            )
            lot.quantity -= take
            lot.basis -= removed_basis
            basis += removed_basis
            remaining -= take
            if remaining == 0:
                break
        if remaining:
            raise Conflict("Fill oversells holdings; reconciliation required")
        entries = {
            "cash": value - fee,
            "security_cost": -basis,
            "realized_gain": -(value - basis),
            "fees": fee,
        }
    order.filled += quantity
    order.fees_paid += fee
    order.state = "FILLED" if order.filled == order.quantity else "PARTIALLY_FILLED"
    post(session, portfolio, source, facts, entries)


def snapshot(session: Session, portfolio_id: str) -> dict[str, Any]:
    # The same gate provides a coherent journal/lot/reservation read under READ COMMITTED.
    locked_gate(session)
    portfolio = session.get(Portfolio, portfolio_id)
    if not portfolio:
        raise Conflict("Portfolio not initialized; run migrations and initialization")
    accounts = balances(session, portfolio_id)
    lots = session.scalars(
        select(Lot).where(Lot.portfolio_id == portfolio_id, Lot.quantity > 0)
    ).all()
    return {
        "id": portfolio.id,
        "version": portfolio.version,
        "currency": "USD",
        "environment": portfolio.environment,
        "capital": str(portfolio.capital),
        "cash": str(accounts.get("cash", ZERO)),
        "realized_pnl": str(-accounts.get("realized_gain", ZERO)),
        "fees": str(accounts.get("fees", ZERO)),
        "valuation_status": "NO_MARKS" if lots else "CASH_ONLY",
        "equity": None if lots else str(accounts.get("cash", ZERO)),
        "positions": [
            {
                "instrument": lot.instrument,
                "scope": lot.strategy_scope,
                "quantity": str(lot.quantity),
                "cost_basis": str(lot.basis),
            }
            for lot in lots
        ],
    }
