# ADR 0008: Deterministic authoritative Risk Engine

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

Global Guardrails must constrain every proposal and profile; AI cannot override them.

## Decision

Risk evaluation uses deterministic code and versioned inputs/policies with APPROVE, RESIZE or REJECT outcomes. It may reduce size, not rewrite thesis or security.

## Alternatives considered

LLM risk adjudication cannot supply reproducible hard limits. UI-only limits are bypassable. Portfolio Manager alone does not establish an independent hard gate.

## Consequences

All entry/exit execution needs final checked authorization. Risk decisions must include bound input/policy versions; technical failure is not approval.

## Unresolved details

OD-07/12: numeric limits, reducing-exit behavior and health policies; OD-01 transaction mechanism. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
