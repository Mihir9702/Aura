# ADR 0002: React and TypeScript web frontend

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

The seed explicitly specifies a polished React/TypeScript interface using Vite, Tailwind CSS and shadcn/ui where appropriate.

## Decision

Use React/TypeScript/Vite and the named styling approach. Keep financial authority in the backend and consume versioned contracts.

## Alternatives considered

Server-rendered Python UI is simpler for a small dashboard but does not match the requested frontend. A full-stack React server framework is not needed for this authenticated application without evidence.

## Consequences

Typed clients and semantic tokens support consistent complex views. Command success must be server-confirmed; frontend decimal formatting must preserve precision.

## Unresolved details

OD-13/16: transport, authentication, design identity and exact package versions. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
