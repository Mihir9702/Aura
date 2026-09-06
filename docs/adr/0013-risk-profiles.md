# ADR 0013: Risk profiles under Global Guardrails

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

The seed explicitly defines Conservative, Balanced and Aggressive profiles with Balanced default and non-removable Global Guardrails.

## Decision

Profiles alter permitted risk budgets within common hard guardrails. No user/AI/profile can disable integrity constraints.

## Alternatives considered

An unconstrained Aggressive mode contradicts the seed. One fixed budget does not support requested user profiles.

## Consequences

Profile/policy versions must be auditable, with final checks after changes. Dynamic regime exposure remains experimental until approved.

## Unresolved details

OD-07: actual profile limits and allocation/breach behavior; profile names do not define numerical policy. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
