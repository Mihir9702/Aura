# ADR 0010: Central Model Router

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

Model workloads vary in cost, importance, difficulty and latency, and model choices must not be scattered through the application.

## Decision

All AI inference goes through a server-side Router with workload-based policy and auditable provider/model selection.

## Alternatives considered

Hard-coding models per call creates inconsistent budgets, privacy and fallback behavior. A large dynamic routing optimizer is premature.

## Consequences

Central policy enables bounded escalation, usage accounting and evaluations. Fallbacks must meet approved quality/privacy constraints; routing cannot override execution/risk.

## Unresolved details

OD-08/09/14: roles, provider catalog, budgets, model qualification and fallback policy. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
