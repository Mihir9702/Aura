# ADR 0011: Dedicated Knowledge Library

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

The seed requires legally usable reference material and accumulated empirical findings. Reference claims are hypotheses, not proven trading rules.

## Decision

Maintain a dedicated versioned Knowledge Library with provenance, citations and separation between reference assertions and evaluated results.

## Alternatives considered

Untracked prompt attachments lose provenance. Treating all retrieved text as trusted executable guidance violates security and scientific evaluation.

## Consequences

Rights/access/temporal controls are needed. Retrieval implementation can start simply; no vector database is mandated by this decision.

## Unresolved details

OD-10: corpus, rights/retention, retrieval/indexing; OD-15: empirical credibility/promotion criteria. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
