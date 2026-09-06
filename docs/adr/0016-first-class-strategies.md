# ADR 0016: First-class Strategy Pods and scoped qualification

Status: **Accepted — SETTLED by product owner**. Date: 2026-09-05.

## Context and history

Extends ADR-0007; supersedes initial Design Bible placement of Pods inside Discovery and treatment of the five names as mere examples.

## Decision

Strategies owns versioned methodologies, lifecycle, qualification and activation. Discovery scans/routes; Research and active workflows invoke identical versioned Pod logic. Structurally support all five named Pods and simultaneous horizons. DEVELOPMENT/BACKTESTING/PAPER_SHADOW/QUALIFIED/ACTIVE_PAPER/SUSPENDED is distinct from implementation status.

## Alternatives

Keeping Pods inside Discovery obscures reuse and ownership. Auto-activating implemented code or transferring qualification across horizons is rejected.

## Consequences and remaining decisions

Scope-specific human-approved qualification plus activation is required for entry; suspension races serialize with admission. Held lots remain monitored and may exit safely. Numeric qualification criteria remain OD-15.

Authority: [owner refinement record](../design-bible/18-owner-decisions.md). Parameter status: [Open Decisions](../design-bible/15-open-decisions.md). Original ADR-0001–0014 remain unchanged; historical “unresolved details” in those records are interpreted using this amendment series and the current register.
