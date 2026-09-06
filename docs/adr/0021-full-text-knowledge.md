# ADR 0021: Adopt rights-aware full-text-first Knowledge Library

Status: **Accepted — SETTLED by product owner**. Date: 2026-09-05.

## Context and history

Extends ADR-0011, closing retrieval architecture direction in OD-10.

## Decision

Use rights-aware versioned full-text-first retrieval with provenance/citations and temporal/access filtering. Add embeddings/vector retrieval only after evaluation demonstrates material benefit.

## Alternatives

Starting with vector infrastructure without demonstrated need adds cost and complexity. Unversioned/trusted document imports lose rights/provenance and injection defenses.

## Consequences and remaining decisions

Actual corpus permissions, retention/deletion and evaluation targets remain open. Full-text retrieval does not remove historical-model contamination or injection concerns.

Authority: [owner refinement record](../design-bible/18-owner-decisions.md). Parameter status: [Open Decisions](../design-bible/15-open-decisions.md). Original ADR-0001–0014 remain unchanged; historical “unresolved details” in those records are interpreted using this amendment series and the current register.
