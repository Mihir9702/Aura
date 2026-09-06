# ADR 0007: Strategy Pods separate from AI agents

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

The seed distinguishes defined investment methodologies from specialized evidence-analysis roles.

## Decision

Pods own versioned methodology and opportunity generation. AI roles assess evidence and help adjudicate candidates. Neither gets broker authority.

## Alternatives considered

Making each strategy an unconstrained agent blurs rules, evidence, evaluation and authority. A single generic LLM trader would violate the product design.

## Consequences

Pods and roles can be evaluated independently; multiple horizons remain attributable. Structured text-derived signals must be explicit inputs with provenance.

## Unresolved details

OD-03/08: initial methodologies, roles, thresholds and analysis depth. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
