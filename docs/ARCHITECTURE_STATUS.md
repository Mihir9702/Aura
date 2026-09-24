# Aura architecture and implementation status

Updated: 2026-09-10. The owner authorized a build after the architecture refinement. The first runnable local foundation now exists. **M0/M1 are partially implemented; no complete trading-platform or milestone acceptance is claimed.**

## Implemented now

Authenticated React/TypeScript/Vite/Tailwind workspace; FastAPI and generated OpenAPI/TypeScript contracts; PostgreSQL 17 migrations; once-only 500.00 USD challenge funding; balanced append-only transaction-sealed journals; persistent audited Entry Halt/Full Kill; SSE refresh; isolated SHADOW fixture reservations/fractional fills and unknown-submission recovery primitives; outbox/inbox acknowledgement; Windows setup/check scripts and native restore drill.

See [implementation status](IMPLEMENTATION_STATUS.md) for module-by-module limitations and [README](../README.md) for runnable commands. The local UI remains Observe/Balanced/PAPER and exposes no order submission or mode-switch endpoint. All five Pod methodologies remain UNIMPLEMENTED; registry/lifecycle and temporal/risk primitives do not imply qualification. Full Kill re-arm is unavailable until actual health/reconciliation prerequisites can be verified.

## Verification

13 domain tests, 11 real PostgreSQL integration tests, Chrome end-to-end navigation/control/mobile verification, Ruff, strict mypy, TypeScript and production Vite build passed. Native PostgreSQL backup/restore verified balanced journals and unique challenge funding. These are subset tests, not all design acceptance criteria.

## Settled architecture preserved

OD-01 is approved with amendments. First-class Strategies and deterministic Regime domains, five named Pods with per-version/horizon qualification, shared 500.00 USD initial capital, LONG-only/no-leverage/conditional fractions, approved six Committee roles, offline League, canonical Ledger, paper-only execution and Global Guardrails remain authoritative.

Entry Halt permits only healthy authorized reducing exits; Full Kill blocks all new submissions, never auto-liquidates and requires human re-arm. Single-owner Windows-friendly local development and authenticated single-owner hosted target/SSE direction remain settled. Rights-aware full-text-first Knowledge and multi-metric evaluation remain the target.

[Owner decisions](design-bible/18-owner-decisions.md), [23 ADRs](adr/README.md), [20 Mermaid sources](diagrams/README.md) and the [Design Bible](design-bible/README.md) distinguish target design from implemented scope.

## Remaining decisions and next work

The [register](design-bible/15-open-decisions.md) retains eligibility/signal/horizon/schedule rules, market/news/paper/model/hosting selection, price/cost/settlement/lot/action conventions, exit consent, final numeric risk/allocation limits, required-role policy, corpus rights/retention, health/recovery targets, budgets, benchmark/qualification thresholds and ADIYA-informed identity.

M0/M1 development can continue using explicit synthetic fixtures: persist scoped qualifications, implement receipt quarantine/replay/corrections and substantive scheduling, then qualify an Observe data/strategy slice. Do not choose production policy through test defaults. Before active paper entries, approve relevant open policies and obtain actual data/adapter qualification plus Pod/horizon qualification and activation.

Highest residual risks: incomplete operational recovery beyond fixtures, fractional actions/corrections, causal data/regime availability, eligibility/control races, realistic fill assumptions and unproven AI value after costs. Regime-adaptive allocation remains EXPERIMENTAL. No vendor, model, API price, monthly budget or numeric trading limit was invented.

Original seed/ADR history is preserved; the new implementation ADR records engineering choices. Architecture-phase reviews remain historical evidence; this status and IMPLEMENTATION_STATUS govern present readiness.
