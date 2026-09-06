# System safety, security, deployment, and cost

## Capability controls and component Health Gates — SETTLED

Technical risk is distinct from investment risk. Detect stale/missing feeds, database failure, model failure, adapter failure, Ledger inconsistency, duplicate processes and clock problems. Replace ambiguous operational “stop” with separately persisted controls and action-specific health.

| Control | Entry / increase | Reducing exit | Receipts, Ledger, reconciliation, diagnostics |
|---|---|---|---|
| Normal controls | Only with mode permission, active qualified strategy, healthy required dependencies and risk approval | Only with exit permission, healthy required dependencies and risk approval | Continue when dependencies allow |
| ENTRY HALT | Block | May continue under the same required exit gates | Continue; keep observing positions |
| FULL KILL | Block all new submissions | Block all new submissions; no auto-liquidation | Continue; best-effort cancel working paper orders |
| Component Health Gate | Block actions requiring unhealthy dependency | Fail closed if required data/Ledger/adapter/policy integrity is insufficient | Preserve independent capabilities; report unavailable processing honestly |

These are independent controls, not a mode that can grant authority. Observe submits nothing even under Entry Halt. Full Kill dominates both order classes. Clearing Full Kill does not clear Entry Halt, unhealthy gates, missing approval or strategy suspension. Cancellation is an operational request, not a new trade order; cancel/replace includes a new order that must pass admission controls.

Health records have component/scope, capability (ingest, analyze, monitor, authorize_entry, submit_entry, authorize_exit, submit_exit, receive, post_ledger, reconcile, cancel), status HEALTHY / DEGRADED / HALTED / RECOVERING, reasons, observed time/expiry and version. A summary badge is not the gate. Evaluate required dependencies per action under approved policy; optional model outage cannot invent a required-role waiver. Unknown/expired health fails closed for required execution dependencies. Thresholds and automated trigger mapping remain OD-04/08/12.

## Admission and recovery semantics

Entry Halt and Full Kill persist by portfolio with global parent controls. Activation and dispatch admission serialize on the authoritative gate, with a documented global → portfolio → strategy-scope lock order. After Full Kill commits, no new dispatch is admitted. After Entry Halt commits, no new/increasing exposure dispatch is admitted. An operation admitted earlier is in flight even if its network write/ack is later; no claim of zero later fills is possible.

Full Kill best-effort cancels all working paper orders. The adopted conservative Entry Halt handling best-effort cancels unfilled entry/increase orders while preserving reducing working orders subject to their dependencies. Retain reservations until confirmed cancellation or fill reconciliation; never free money solely because a halt was requested. Surface in-flight/unknown orders and blocked exit risk prominently. A reducing action is proven from current long holdings and reserved quantities, not an AI-supplied label; it may not cross zero into a short.

Keep ingestion/monitoring/receipts/posting/reconciliation where healthy; Ledger outage means receipts must be durably recovered and posting is visibly unavailable, not falsely “continuing successfully.” No unsafe exit substitutes stale prices or bypasses Ledger integrity. Database failure already prevents authoritative admission. An unconfirmed control request shows “activation unconfirmed”; pre-admitted work remains a recovery obligation.

Record actor, reason, scope, control generation, timestamps, affected orders and incident ID. Restart preserves controls. **Full Kill requires explicit human re-arm**, healthy required dependencies, clock/data checks and reconciled orders/Ledger. Re-arm increments generation, invalidating old unsubmitted authorizations; it never submits a liquidation or resumes from a model instruction. Entry Halt release is explicit and auditable under its approved policy; automated trigger/release details remain OD-12, with explicit human release the conservative M0/M1 fixture baseline. Control release is not order permission.

Same capability checks apply to entries/exits at final authorization and immediately before dispatch. Suspended strategies cannot add risk but retained positions may still reduce under applicable exit permission and health. Numeric health/recovery targets and emergency policies remain open, not inferred from the control names.

## Security architecture

SETTLED: credentials server-side, least privilege, untrusted text never treated as instructions. Adopted controls:

- Authenticate API commands and authorize portfolio/document scope on every read/write. Single-owner local development and authenticated single-owner hosted operation are settled; multi-tenancy is out of scope. Auth implementation remains OD-13. Local mode still needs deliberate binding/session controls.
- Separate API, worker, migration, and read-only analytical database privileges where deployed. AI workers have no execution capability or direct policy writes.
- Allowlist paper endpoints/account identities; validate environment at startup and adapter qualification. Refuse live credentials/endpoints, with no bypass flag. Never put provider secrets in Vite environment variables shipped to the browser.
- Treat uploads as hostile: type/size limits, quarantined parsing, no macros/scripts, restricted parser resources, path traversal checks. Retrieval URLs require SSRF protection, scheme/host checks, redirect validation, and private-network restrictions.
- Delimit untrusted evidence, restrict tools/egress, validate structured model output/citations, sanitize rendered HTML/Markdown, and test exfiltration instructions embedded in documents. Prompt injection cannot gain authority the model does not possess.
- Parameterize database queries, validate command schemas, protect browser sessions against CSRF/XSS as appropriate to chosen authentication, rate-limit expensive commands, and redact credentials/content in logs.
- Record administrative changes and dependency versions; review dependency provenance and security updates. Backups follow encryption/access controls. Document retention and provider data-use policy before sending licensed/private content to models.

Threat cases: malicious article says “ignore risk” → proposal-only privilege and risk gate; citation points to another user's document → retrieval authorization; article includes callback URL → no arbitrary model network; model returns oversized quantity → strict schema then deterministic allocation/risk; replay emits old order event → no active authorization and sandbox isolation. Malicious content detection alone is not the security boundary.

## Observability and audit

Structured logs carry trace/correlation IDs, module, entity/version, actor, state transition, reason, and timing, excluding secrets. Durable decision records answer what happened, why, when, what was known, which Pod/model/policy acted, and later outcomes. Audit persistence failure prevents consequential commands from committing. Metrics/logs/traces supplement, not replace, durable records.

Required metrics: feed freshness/gaps, feature lag, queue age/dead letters, model latency/cost/schema failure, candidate funnel reasons, risk outcomes, reservation age, unknown orders, duplicate receipts, fill-to-ledger lag, ledger reconciliation differences, monitor delay, Entry Halt/Full Kill admissions and blocked-exit reasons, and report watermarks. Alert severity maps to blocked capability and an operator runbook. SLO/alert thresholds are OD-12/14, never fabricated here.

## Deployment — adopted single-owner direction

Local development: single owner, Windows-friendly tooling, one repository; web dev server, FastAPI process, durable worker/scheduler, PostgreSQL, and local analytical volume. Authenticated single-owner hosted paper target: built static web assets behind HTTPS, API and worker processes from one versioned backend image, PostgreSQL, durable dataset/artifact storage, backups, and telemetry. These are process roles, not separate domain microservices. SSE is the initial live-update mechanism with polling/authoritative refresh fallback. Exact hosting vendor, auth implementation, runtime versions and CI provider remain OD-13/M0 technical decisions.

Use separate development, test, research, and active-paper configurations/identities/data roots. Startup validates config schema, paper adapter capabilities, migrations, and policy completeness. Maintenance/redeploy stops new dispatch, drains or reconciles in-flight work, migrates safely, restores monitoring, then explicitly evaluates gate readiness. Rollback must account for schema compatibility and persisted jobs; restoring an old binary does not undo fills. Restore drills keep execution halted until external paper state reconciles.

## Cost controls

Budget market data, model calls, historical storage, compute scans, and observability retention. Apply cheap-to-expensive discovery, bounded committee roles, evidence caching, event-triggered reanalysis, batch analytics, compressed Parquet, and scheduled research limits. Track estimated versus actual model cost by role/Pod/run, including retries and fallback. An exhausted AI budget defers optional analysis; it never disables ledger posting, reconciliation, or deterministic safety monitoring. Provider invoices can lag estimates; conservative reservation and hard local dispatch caps bound exposure. OD-14 supplies actual spending ceilings and exhaustion policy.
