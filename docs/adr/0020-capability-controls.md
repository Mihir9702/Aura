# ADR 0020: Entry Halt, Full Kill and component Health Gates

Status: **Accepted — SETTLED by product owner**. Date: 2026-09-05.

## Context and history

Supersedes the single operational-stop semantics of initial OD-12 and associated Design Bible/diagrams; preserves paper-only and deterministic risk ADRs.

## Decision

Entry Halt blocks new/increasing exposure while allowing healthy authorized reducing exits and continued observation. Full Kill blocks all new submissions, best-effort cancels working paper orders, preserves receipts/Ledger/reconciliation/diagnostics, does not auto-liquidate and requires explicit human re-arm. Retain action-specific component Health Gates; unsafe exits fail closed visibly.

## Alternatives

One ambiguous stop conflates entry restraint with complete submission stop. Treating Entry Halt as unconditional exit permission or Full Kill as auto-flatten is rejected.

## Consequences and remaining decisions

Control generations serialize with admission. In-flight fills still reconcile; reservations remain until confirmed. Clearing one control does not clear others or mode/qualification. Thresholds/automatic triggers remain OD-12.

Authority: [owner refinement record](../design-bible/18-owner-decisions.md). Parameter status: [Open Decisions](../design-bible/15-open-decisions.md). Original ADR-0001–0014 remain unchanged; historical “unresolved details” in those records are interpreted using this amendment series and the current register.
