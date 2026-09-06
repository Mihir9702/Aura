# Aura architecture status

Updated: 2026-09-05 after product-owner refinement. Scope: **documentation only**. Original [seed](../Aura_Seed.md) and ADR-0001–0014 are preserved. No application code, dependencies, executable schemas, migrations or integrations were created.

## Newly settled owner decisions

- **OD-01 APPROVED WITH AMENDMENTS:** detailed engineering baseline and tooling direction adopted; no need to ask for approval again.
- First-class Strategies domain; all five named Pods structurally supported; shared versioned research/active logic; simultaneous horizons, scoped qualification and explicit activation separate from implementation.
- Deterministic versioned Market Regime Engine; AI cannot set canonical state. Adaptive allocation/risk remains EXPERIMENTAL.
- **500.00 USD** initial shared challenge capital; capital-independent architecture; LONG-only US equities/ETFs, no leverage/shorts, fractionals where instrument/adapter support them; unsupported mechanics fail closed. Options data is evidence only.
- Approved six Committee roles, concurrent required specialists then adjudication, measured escalation, code-owned quantitative calculations.
- Entry Halt and Full Kill are separate from component Health Gates. Healthy authorized reducing exits may continue under Entry Halt; Full Kill blocks all new submissions, best-effort cancels, preserves receipts/Ledger/reconciliation/diagnostics, never auto-liquidates and requires human re-arm.
- Default Observe; Assisted and Autonomous share the same authority/audit path. Balanced remains default under Global Guardrails.
- Single-owner Windows-friendly local development; authenticated single-owner hosted target, no multi-tenancy; API/worker process roles and SSE updates.
- Rights-aware versioned full-text-first Knowledge Library; embeddings only after material measured benefit.
- Offline League and multi-metric evidence scorecards, no direct order authority or raw reward-for-risk; owner-approved versioned policy required to use evidence for qualification/allocation.

See [owner decision record](design-bible/18-owner-decisions.md), [22 ADRs](adr/README.md), [Design Bible](design-bible/README.md) and [19 editable Mermaid diagrams](diagrams/README.md).

## Genuinely open decisions

The [register](design-bible/15-open-decisions.md) now distinguishes approved portions from residual questions. Open: eligibility thresholds; Pod/horizon implementation priority and exact signal/session/cadence rules; data/news/paper/model/hosting vendors; order/increment/minimum/cost/simulation details; approval expiry/exit consent; final numeric risk/allocation limits; required-role escalation/failure policy; actual corpus rights/retention; settlement/lot/fee/action/rounding/valuation conventions; health trigger/release thresholds and recovery targets; hosted auth/backup implementation; spending amounts; evaluation benchmarks/thresholds/windows; ADIYA-informed UI direction; regime definitions/thresholds/approved macro inputs (OD-17).

No vendor, runtime model, API price, monthly budget, or final numeric risk/qualification limit was selected.

## Readiness for an implementation prompt

**Yes: ready for a bounded M0/M1 implementation prompt.** OD-01 and minimum local runtime direction are already approved. This documentation request itself still does not authorize coding. A capable implementing agent can follow [module/repository plan](design-bible/13-implementation-plan.md), [contracts](design-bible/12-contracts.md) and [32 acceptance cases](design-bible/14-verification.md) without prior chat history.

M0 may select/pin compatible tool versions, create Windows-friendly commands, module/API/contracts/config/SSE foundations and single-owner local safety. M1 may implement journals, fractional invariants, 500.00 funding, shared reservations, qualification/capability gates and deterministic recovery using explicitly labeled synthetic fixtures.

**Safely deferred during M0/M1:** external vendors/model names/prices/budgets, hosting vendor, UI screenshots, real corpus selection, exact production signal/regime thresholds and schedule/qualification criteria. Unsettled accounting/order conventions can be mandatory configuration or alternative test fixtures; do not silently make them live defaults. Local access controls and fail-closed configuration cannot be deferred. No paid/live data or active-paper submission is implied by fixture completion.

Before active-paper entries: approve residual policies for the enabled scope, qualify actual data/adapter capabilities, settle required accounting/exit/risk rules, build the minimum prospective qualification evidence slice and obtain Pod-version/horizon qualification plus activation. M3 cannot bypass this merely because broad Research League work is scheduled for M5. Each Pod/horizon qualifies separately.

## Highest-risk assumptions and review outcome

Highest risks remain causal historical data/regime availability, adapter identity/reconciliation, fractional precision/corporate actions at small capital, concurrent shared allocation, stale eligibility/control races, realistic paper fills, and whether AI adds value after costs. Seconds-level/HFT capability is unqualified. In-flight operations may still fill after halt/suspension; no zero-later-fill promise is made.

Completed a fresh [adversarial review](design-bible/16-architecture-review.md), addressing capital duplication, strategy reuse/qualification races, fractional residuals, Entry Halt/Full Kill composition, regime leakage, League feedback and milestone dependencies. Local documentation link/inventory/source checks are reported in that review. Mermaid sources are editable but not rendered here; no application tests can run without an implementation.
