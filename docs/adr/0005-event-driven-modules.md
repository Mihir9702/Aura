# ADR 0005: Event-driven modular architecture

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

Data changes, analyses, orders, monitoring and research need auditable coordination without tangled direct side effects.

## Decision

Use explicit domain modules, typed interfaces and versioned events. Events report facts; they do not grant execution permission.

## Alternatives considered

A single synchronous call chain is easy initially but couples latency and recovery. An untyped event bus hides ownership and encourages accidental authority.

## Consequences

Consumers must tolerate retries and ordering limits. Critical cross-module atomic work may use a coordinating application transaction in the monolith.

## Unresolved details

OD-01: recommended transactional outbox/inbox/jobs and detailed envelope; no external broker selected. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
