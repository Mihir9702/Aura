# ADR 0015: Owner-approved baseline and runtime direction

Status: **Accepted — SETTLED by product owner**. Date: 2026-09-05.

## Context and history

Amends unresolved implementation details in ADR-0001–0006 and adopts OD-01; original ADR text is preserved.

## Decision

Adopt detailed engineering/tooling baseline with the owner amendments, single-owner Windows-friendly local development, authenticated single-owner hosted target, API/workers from one backend, SSE initial updates and default Observe. uv/npm, pytest/Ruff plus type checker, SQLAlchemy/Alembic, generated contracts, Vitest/Testing Library/Playwright are approved directions.

## Alternatives

Reopening the baseline or adding multi-tenancy/microservices would contradict the owner direction. Exact versions and generators remain M0 technical choices; hosting/auth vendor decisions remain open.

## Consequences and remaining decisions

A subsequent implementation prompt can start M0/M1 without reapproval of settled decisions. No application exists and no vendor, model, price, budget or numeric risk threshold is selected.

Authority: [owner refinement record](../design-bible/18-owner-decisions.md). Parameter status: [Open Decisions](../design-bible/15-open-decisions.md). Original ADR-0001–0014 remain unchanged; historical “unresolved details” in those records are interpreted using this amendment series and the current register.
