# ADR 0001: Python and FastAPI backend

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

The platform needs deterministic quantitative computation alongside asynchronous I/O and a typed web API. The seed prefers Python/FastAPI; the architecture brief explicitly requests this settled ADR.

## Decision

Use Python for backend/domain/quantitative logic and FastAPI for the HTTP application boundary. Keep domain functions independent of the framework.

## Alternatives considered

A TypeScript-only backend reduces language count but gives up the preferred quantitative ecosystem. Separate language services increase operational complexity before evidence supports them.

## Consequences

Python CPU-intensive analytics must not block HTTP or monitoring workers. Use bounded worker processes where measured necessary. FastAPI is an adapter, not the location for risk or accounting policy.

## Unresolved details

OD-01/13: Python/runtime versions, dependency manager, validation and persistence libraries. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
