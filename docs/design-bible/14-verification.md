# Testing strategy and acceptance criteria

This is a **adopted verification plan**, not a report of application tests passing. No executable implementation exists. The documentation review record is in [architecture review](16-architecture-review.md).

## Test layers

- Unit/property tests: features, sizing, typed rule evaluation, accounting/lot invariants, rounding, expiry, deterministic ranking, and state transitions.
- Contract tests: provider normalization, API/event schemas, version compatibility, decimal transport, model structured output, and adapter capabilities.
- Integration tests with real PostgreSQL: atomic outbox/inbox, unique fill application, allocation gate locks, migrations, leases/fencing, and projection rebuild.
- Replay/backtest tests: pinned manifests/clock/policy/model outputs; no look-ahead; survivor-free universe fixtures; costs/latency/session edge cases.
- Fault tests: disconnects, crash windows, delayed/duplicate/out-of-order fills, partial cancel, lease loss, database outage, clock jumps, stale data, AI timeout, budget exhaustion, Entry Halt versus Full Kill, strategy suspension, and restore.
- Browser/system tests: Observe, Assisted Paper, Autonomous Paper; explicit approval/expiry; entry/monitor/exit; Entry Halt/Full Kill/re-arm; report revisions and stale/denied states.
- AI evaluation: fixed adversarial/factual/citation cases plus held-out prospective role evaluation and no-AI ablations.

## Acceptance matrix

| ID | Scenario | Required evidence |
|---|---|---|
| AC-01 | Paper boundary | Live endpoint/credential/config attempts rejected; browser/model cannot call execution; tests and research cannot access active adapter |
| AC-02 | Duplicate fill | Repeated receipt/event/redrive produces one economic posting and one quantity change |
| AC-03 | Competing allocation | Concurrent proposals together exceeding capacity cannot both reserve it; committed reservations reconcile to orders |
| AC-04 | Unknown submission | Crash/timeout after remote acceptance creates no duplicate order; reservation stays until identity reconciles |
| AC-05 | Partial fill and cancel race | Fill before/after cancel acknowledgment is booked once; only confirmed remainder released; no oversell |
| AC-06 | Ledger correctness | Balanced journals, valid lot quantities, equity/P&L identity, decimal rounding, rebuild and correction reversal; 500.00 USD fractional worked example agrees |
| AC-07 | Full Kill race | No post-Full-Kill dispatch admissions for entry or exit; pre-admitted orders identified/reconciled; best-effort cancel; no auto-liquidation or restart re-arm; explicit human re-arm |
| AC-08 | Stale approval/data | Superseded proposal, policy/mode change, expired price/authorization, or quality failure forces final reevaluation/block |
| AC-09 | Historical leakage | Future bar/revision/fundamental/universe member cannot enter earlier decision; delisted security remains in test universe |
| AC-10 | Deterministic replay | Same recorded inputs/policies/outputs/clock yield same risk, ledger, and events modulo declared nonsemantic IDs |
| AC-11 | Prompt injection | Malicious article/document/model output gains no secrets, tools, policy write, broker access, or unsupported citations |
| AC-12 | Mode separation | Observe creates no submissions; Assisted requires bound permission; Autonomous uses same risk/audit gates |
| AC-13 | Thesis/exit integrity | Time/stop triggers create controlled exits; duplicate triggers cannot oversell; loss cannot silently extend horizon |
| AC-14 | AI quality/failure | Required role failure blocks that policy; invalid JSON/citations rejected; usage capped; recorded output replay differs from reinference testing |
| AC-15 | Shadows/League | Isolated capital/cost/inclusion policy; no hindsight entries; sample/uncertainty/undefined metrics shown; active ledger unchanged |
| AC-16 | Restore/recovery | Restored DB has referenced manifests; adapter history closes recovery gap; Ledger reconciles before gate re-arm |
| AC-17 | Reports/UI | Every displayed trade traces to proposal/risk/fill/journal; stale/partial data visible; revised reports retain originals; keyboard-accessible controls |
| AC-18 | Simulation realism | Same-close look-ahead prohibited; spread/fees not double-counted; gap/limit-touch/intrabar ambiguity tested and documented |
| AC-19 | Event/jobs recovery | Crash between commit/dispatch/consume yields no lost committed work or duplicate effect; poison event visible; safety jobs retain capacity |
| AC-20 | Corporate actions | Enabled-universe split/dividend/delisting/correction rules preserve accounting and temporal evidence; unsupported events block qualification |
| AC-21 | Cost behavior | Concurrency/retry/fallback cannot escape budgets; exhausted research/AI budget preserves monitoring/ledger work |
| AC-22 | Learning governance | Model/experiment cannot modify or promote production logic; promotion has owner approval, frozen evidence, and regression record |

## Owner-amendment acceptance cases

| ID | Scenario | Required evidence |
|---|---|---|
| AC-23 | Simultaneous Pods/horizons | All five names have explicit implementation/lifecycle states; same versioned logic in research/active paths; competing intents share one 500.00 USD balance/reservation gate, never 500 per Pod |
| AC-24 | Qualification/suspension race | Unqualified or stale scope cannot enter via Assisted or Autonomous; scope/version/horizon approval checked at admission; concurrent suspension blocks later admissions; in-flight orders reconcile; held lots still monitor/exit |
| AC-25 | Fractional capabilities | Exact decimal partial fills/fees/basis reconcile; effective instrument/adapter increments honored; unknown/unsupported fractions rejected; rounding cannot exceed cash or create shorts; dust remains visible |
| AC-26 | Entry Halt | New/increasing orders blocked; healthy authorized reducing exits allowed; Observe or missing exit permission still blocks; increasing working remainder canceled best-effort without early reservation release |
| AC-27 | Unsafe exit / control composition | Missing required market/Ledger/adapter/policy health blocks exit prominently; Full Kill blocks healthy exits too; clearing Full Kill does not clear Entry Halt/health/mode/qualification |
| AC-28 | Regime causality | Same deterministic version/as-of inputs give same regime; later macro revisions/universe changes/fitted parameters excluded; missing required regime is NOT_READY; LLM cannot write canonical state |
| AC-29 | League isolation | Score changes cannot authorize an order, increase size, promote a strategy or change limits; only reviewed versioned owner-approved policy may use evidence; regime-adaptive risk remains unavailable |
| AC-30 | Single-owner/defaults | Fresh environment defaults Observe/Balanced/PAPER; hosted access authenticated and single-owner; SSE reconnect refreshes truth; Windows bootstrap/check commands work once implemented |
| AC-31 | Committee and evidence | Approved six roles; specialists share frozen bundle, Adjudicator waits for required valid returns; quant calculations remain code-owned; Challenger records contradictions/invalidation; selective escalation policy is versioned |
| AC-32 | Capital generality/funding | Initial challenge posts exactly 500.00 USD once, including restart/duplicate command; other labeled capital fixtures demonstrate independence; no hidden top-up or per-Pod funding |

Tests must include suspension/Entry Halt/Full Kill racing with authorization, dispatch, partial fill and cancellation. Initial LONG-only sells can never cross zero, including multiple simultaneous exit triggers and fractional rounding. An owner-approved qualification record is not sufficient if its scope or policy is stale.

## AI evaluation protocol

Pin task definitions, evidence bundles, prompt/routing versions, label cutoffs, evaluator rules, and budgets. Separate output-validity rate from factual correctness, citation entailment, calibration, predictive usefulness, latency, and cost. Human-reviewed reference cases should include ambiguity, conflicting sources, missing evidence, out-of-date documents, malicious markup, and wrong instrument aliases. Assess numerical claims against deterministic references.

Hold out evaluation cases and prospective periods from prompt tuning; log all model/prompt candidates and repeated runs to expose variance and selection. Use human review where label quality requires judgment, with rubric and disagreement recording. Confidence calibration needs resolved outcomes and declared bins/metrics; do not call a model calibrated from its self-report. Role ablations compare the same opportunity cohorts with/without the role under equal budgets/policies. OD-08/15 establishes release thresholds; until then, evaluations can report measurements but cannot assert qualification.

## Release evidence

Attach commit/config/policy versions, input fixtures/manifests, executed commands, test outcomes, integration capability qualification, unresolved limitations, cost/latency measurements, and operational runbooks to milestone completion. CI should block contract drift, invariant failures, and paper-boundary violations. Timing/performance targets await OD-03/12; passing functional tests does not establish seconds-level operation. Do not invent coverage percentages as a substitute for meaningful failure tests.
