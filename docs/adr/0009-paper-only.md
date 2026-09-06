# ADR 0009: Paper execution boundary

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

Initial Aura must execute no real-money orders while retaining an extensible broker interface.

## Decision

Only Order Manager uses Broker Interface and a Paper Broker Adapter. Initial implementation has no live adapter, live credential support or switch enabling real execution.

## Alternatives considered

Embedding vendor calls throughout modules makes the boundary unauditable. Shipping dormant live code with a configuration flag weakens the initial constraint.

## Consequences

Simulation/vendor qualification and negative boundary tests are mandatory. A future live phase would require a separate explicit product/architecture decision, not merely another adapter file.

## Unresolved details

OD-05/11: paper provider/simulator capabilities and accounting/fill assumptions. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
