# Independent challenge of the architecture

Review method: after drafting the architecture, examine it from failure, skeptical research, accounting, security, and operations perspectives. This is a separate self-review pass, not a claim that an external reviewer or second agent approved it. Findings below have been incorporated into the package; empirical validation remains future implementation work.

| Challenge | Weakness found | Revision in this package | Residual proof required |
|---|---|---|---|
| Unnecessary complexity | Many domains can imply many services | One Python distribution, one operational DB, worker roles from same codebase; Redis/vector/broker deferred | Measure workload before extraction |
| Premature distributed consistency | Events alone cannot reserve cash atomically | Portfolio gate transaction coordinates risk/reservation/order/outbox via owning interfaces | AC-03/19 with real PostgreSQL |
| Concurrent orders/exits | Two candidates or stops can spend/sell same capacity | Filled exposure plus all reservations, portfolio version lock, quantity-reserved exits | AC-03/05/13 |
| Duplicate truth | Adapter balances, analytics and UI may compete with Ledger | Ledger postings/lots canonical; all other balances are reconciled or derived | AC-06/16/17 |
| Look-ahead | Event timestamps alone permit restatements/future bars | Knowledge-time cutoffs, immutable revisions, completed bars, frozen manifests | AC-09/18 |
| Survivorship | Present-day universe flatters historical results | Effective-dated membership and delisting/action fixtures; incomplete history flagged | AC-09/20 |
| Accounting | Position totals without journals obscure fees/corrections | Balanced postings, lot attribution, separate reservations, worked P&L identity, reverse/replace | AC-02/06/20; OD-11 |
| AI authority creep | Adjudication/risk events might be treated as order authority | Typed proposal only; server-created authorization; gate and adapter inaccessible to AI | AC-01/11/14 |
| Injection | Trusted-looking citations can carry commands/exfiltration | Rights/scope checks, restricted tools/egress, quarantined parsing, schema/citation validation | AC-11 and adversarial fixtures |
| Nondeterminism | Temperature zero mistaken for replay | Record model outputs; replay deterministic downstream logic separately from reinference evaluation | AC-10/14 |
| Failure/recovery | Timeout or expired lease mistaken for absent order | SUBMISSION_UNKNOWN, stable client ID, retained reservation, startup reconciliation | AC-04/16/19 |
| Kill switch | Impossible claim of zero fills after a networked kill | Define serialized dispatch admission; preserve and reconcile in-flight orders; no auto-flatten/re-arm | AC-07; OD-12 |
| Simulation optimism | Same-close fills, perfect limits, neglected costs | Next-eligible observation, spread/latency/participation, ambiguous bars, no double-counted slippage | AC-18; OD-05 |
| Research selection | All rejected trades assumed affordable | Capital-constrained shadow policy, decision-time inclusion, registered comparisons | AC-15; OD-15 |
| Excessive cost | Committee/monitoring roles run on every tick | Funnel, bounded Router, event-triggered AI, protected safety queues, research limits | AC-21; OD-14 |
| Ownership gaps | Who commits reservation/fill/order changes unclear | Workflow services coordinate module ports transactionally; Execution receipts versus Ledger facts distinguished | AC-02/03/19 |
| Fake readiness | Technology preferences could imply policy approval | Status vocabulary, dedicated open register, milestone gates and no executable commands | Owner-adopted OD-01 and relevant policies |

## Initial-pass consistency checklist (historical; amended below)

- All entry and exit diagrams converge on Portfolio Manager, mode permission, Risk Engine, Order Manager, paper adapter, and Ledger.
- Observe submits nothing; all profiles obey Global Guardrails; Full Kill blocks new submissions including exits, with in-flight caveat.
- APPROVE/RESIZE/REJECT are the sole Risk Engine outcomes. Technical errors block/retry as errors rather than inventing an approval.
- Ledger receipt/application distinction, reservations, corrections, and decimal accounting agree across contracts/events/storage.
- Events are at least once, ordered per aggregate where needed; idempotency and reconciliation provide effects, not magical delivery guarantees.
- Contracts include each requested entity; state machines include failure/expiry/unknown paths; schemas are explicitly conceptual.
- Stack/monolith choices are accepted ADRs; mechanisms were subsequently adopted in OD-01; residual material parameters remain open.
- No implementation, live-money adapter, approved numeric risk policy, qualified vendor, current pricing claim, or rendered-diagram validation is implied.

Final local checks on 2026-09-05: 35 generated Markdown files plus the preserved seed; 14 numbered ADRs; 16 Mermaid sources; zero broken relative Markdown links; zero unpaired fenced-code blocks or unbalanced Mermaid shape delimiters. These are structural checks, not Mermaid rendering or application execution. A final lifecycle review added explicit proposal/permission states and prohibited reuse of an old approval for a new entry attempt after a terminal order.

See [status](../ARCHITECTURE_STATUS.md) for final readiness and outstanding approvals. The documentation can guide implementation after gates; it cannot prove paper-trading reliability before code and integration tests exist.

## Owner-refinement adversarial review — 2026-09-05

This is a fresh self-review after applying the owner amendments, not an external review or evidence of implementation correctness.

| Challenge | Contradiction/hazard identified | Resolution | Remaining proof |
|---|---|---|---|
| Simultaneous Pods | Discovery ownership and one-Pod language obscured shared reuse | First-class strategies/regime domains; all five structural scope; same versioned evaluation ports across workflows | AC-23; real per-Pod implementations still absent |
| Shared capital | Small 500 capital could be interpreted as per-Pod budget | One initial funding source, shared Ledger/reservations; no independent Pod spending | AC-03/23/32 |
| Fractional accounting | Original large whole-share example missed small-capital rounding/fees | 500.00 example with 2.5-share buy/0.75-share sale, exact equity reconciliation, capability intersections, visible residual dust | AC-06/25; OD-11 rounding/action details |
| Entry Halt versus Full Kill | Old single-stop terminology could incorrectly block safe reducing exits or permit unsafe ones | Independent controls + action-specific health; Observe still denies; Full Kill dominates; no auto-liquidation | AC-07/26/27 |
| Existing orders after halt | Blocking future admissions alone leaves increasing working orders | Best-effort cancel increasing remainder under Entry Halt, all working orders under Full Kill; retain reservations until confirmed | Race/failure tests; in-flight fills remain possible |
| Strategy qualification race | A queued candidate may outlive its approved scope | Qualification generation checked with serialized entry admission; explicit activation; stale score/event cannot restore permission | AC-24; no lock held across network |
| Suspension/expiry | Removing active status could orphan held lots | Monitoring and authorized healthy reducing exits survive eligibility loss | AC-13/24/27 |
| Regime leakage | Revised macro, present-day breadth or fitted full-period thresholds could leak | Frozen availability/universe/parameter cutoffs; immutable snapshots; missing-input status; historical regime separately labeled | AC-09/28; OD-17 taxonomy/thresholds |
| League feedback | Score-to-size feedback could increase risk to win rank | Offline evidence only; owner-approved versioned policy boundary; no direct order, promotion or raw reward channel | AC-29; OD-15 |
| Qualification milestone cycle | M3 active trading before M5 research could imply unqualified entries | Build minimal qualification evidence slice before M3; broad M5 research remains later | Milestone gates and AC-24 |
| Re-arm composition | Clearing Full Kill might inadvertently clear Entry Halt or stale health | Separate persisted control generations and effective permission intersection | AC-27 |
| Fake settled scope | Adopted tooling could be confused with vendor/limit selection | OD-01 closed, partial decisions split, numeric/vendor questions retained | Current register; no implementation/code added |

The refined contracts now carry Pod/horizon/scope, qualification/activation generation, regime references, decimal capabilities and action-specific control evidence. Historical ADR-0001–0014 remain verbatim; ADR-0015–0022 record amendments. The seed is preserved.

No final numeric risk/qualification thresholds, provider/model/vendor, prices or budget have been invented. Documentation is ready for a bounded implementation prompt; runtime correctness, Mermaid rendering and integration qualification remain unproven.

Final refinement checks: 46 Markdown files including the seed, 22 numbered ADRs, 19 Mermaid sources and 32 acceptance cases; zero broken relative links, unpaired Markdown code fences or unbalanced Mermaid shape delimiters. The original seed hash and original ADR contents were checked for preservation. Candidate deduplication was additionally amended to include parameter/horizon/scope so simultaneous horizons do not collide. These are documentation/source checks, not renderer or runtime tests.
