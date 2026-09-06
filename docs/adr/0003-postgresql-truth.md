# ADR 0003: PostgreSQL operational truth

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

Orders, approvals, fills, accounting and audit must survive concurrent activity and failures. The seed names PostgreSQL as operational truth.

## Decision

Use PostgreSQL as the authoritative operational store. Portfolio Ledger is the sole accounting authority within it; projections are derived.

## Alternatives considered

Separate per-domain databases complicate atomic capacity allocation. An analytical store alone is unsuitable for transactional workflow ownership. In-memory state cannot survive recovery.

## Consequences

Transactions and unique constraints can protect reservations and fill effects. Backup/restore and migration design are essential; PostgreSQL does not itself ensure correct accounting.

## Unresolved details

OD-01/11/13: proposed journals/outbox transactions, precision, recovery targets and hosting. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
