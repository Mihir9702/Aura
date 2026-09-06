# ADR 0006: Modular monolith first

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

The seed discourages unnecessary infrastructure; this architecture brief explicitly prefers a strong modular monolith absent contrary evidence. No workload evidence favors distributed services.

## Decision

Start with one modular backend codebase and operational database, allowing API and worker processes from the same build. Extract services only for demonstrated scaling/isolation/ownership reasons and a new ADR.

## Alternatives considered

Microservices increase deployment, consistency and observability burden. A completely unstructured monolith sacrifices the explicit boundaries needed for future work.

## Consequences

Local transactional coordination is practical and deployment stays small. Boundary enforcement and resource isolation still need tests; one process for everything is not required.

## Unresolved details

OD-01/13: process topology, jobs implementation and resource budgets. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
