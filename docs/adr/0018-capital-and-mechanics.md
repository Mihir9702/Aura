# ADR 0018: Initial challenge capital and fractional long-only mechanics

Status: **Accepted — SETTLED by product owner**. Date: 2026-09-05.

## Context and history

Extends ADR-0009/0014 and closes the initial-capital/direction/mechanics portions of OD-05/11.

## Decision

Initial paper challenge funds one shared portfolio with 500.00 USD, posted once. Architecture remains capital-independent. US equities/ETFs LONG-only, no leverage/shorting; fractionals require both instrument/adapter support. Options information is evidence only. Unsupported mechanics fail closed.

## Alternatives

Per-Pod funding duplicates capital. Rounding up or silently enabling leverage to accommodate small capital violates the scope. Assuming all instruments/adapters support fractionals is rejected.

## Consequences and remaining decisions

Decimal precision, partial fills, residual basis/fees and dust need invariant tests. Provider/order/settlement/action/rounding details remain open; no vendor or fee schedule is implied.

Authority: [owner refinement record](../design-bible/18-owner-decisions.md). Parameter status: [Open Decisions](../design-bible/15-open-decisions.md). Original ADR-0001–0014 remain unchanged; historical “unresolved details” in those records are interpreted using this amendment series and the current register.
