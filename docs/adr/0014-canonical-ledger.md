# ADR 0014: Canonical Portfolio Ledger

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

Cash, positions and P&L must reconcile across partial fills, fees, corrections and monitoring. The seed requires one accounting truth.

## Decision

Portfolio Ledger owns accounting facts and derived holdings/value. Adapter reports and analytical/UI snapshots are reconciled views, not alternative truth.

## Alternatives considered

Letting execution, portfolio and reporting each update balances creates divergence. Overwriting totals on reconciliation destroys audit history.

## Consequences

Accounting correctness is a release invariant. Recommended immutable balanced journals/lots permit rebuild and correction lineage; this storage mechanism needs baseline adoption.

## Unresolved details

OD-01/11: journal baseline, cash settlement, fees, lots, valuation and corporate actions. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
