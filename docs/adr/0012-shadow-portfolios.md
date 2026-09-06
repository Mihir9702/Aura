# ADR 0012: Shadow Portfolios

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

Rejected opportunities, independent Pod behavior and alternative decisions must be measurable without altering the active portfolio.

## Decision

Support isolated Shadow Portfolios with explicit decision-time policies and comparable evaluation. They have no active-paper authority.

## Alternatives considered

Keeping only successful/accepted trades hides opportunity cost. Treating every rejected trade as an independent free-capital investment misstates portfolio outcomes.

## Consequences

Shadow ledgers reuse accounting invariants while separating identity/capital. Counterfactual inclusion, costs, allocation and uncertainty must be explicit.

## Unresolved details

OD-15: shadow scope, sampling, capital/benchmark policy and evaluation criteria. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
