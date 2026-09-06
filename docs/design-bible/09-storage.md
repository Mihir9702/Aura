# Database and analytical storage architecture

## Operational truth — SETTLED PostgreSQL

Adopted baseline logical groups (schemas or naming boundaries, not separate databases by default):

| Owner | Principal entities |
|---|---|
| Data/features | instruments, symbol_history, universe_versions, data_manifests, quality_records, feature_definitions, feature_snapshots |
| Discovery | candidates, candidate_revisions, triage_runs |
| Strategies | pod_definitions, pod_versions, horizon_specs, strategy_scope_states, qualifications, activations, eligibility_generations |
| Regime | regime_definitions, regime_snapshots, regime_quality_records |
| Intelligence/knowledge | analysis_runs, analyses, adjudications, proposals, model_calls, documents, document_versions, chunks |
| Portfolio/risk | allocation_intents, policy_versions, risk_decisions, approvals, reservations, execution_gates |
| Execution | orders, order_transitions, submission_attempts, adapter_receipts, fills, reconciliation_runs |
| Ledger | journals, postings, quantity_lots, fill_applications, balances, positions, portfolio_snapshots, marks |
| Research | experiments, dataset_splits, shadow_policies, shadow_trades, evaluations, promotions |
| Platform | users, settings_versions, audit_events, outbox, inbox, jobs, schedules, incidents, reports, capability_controls, health_gates, control_transitions |

Keys are stable IDs; references to mutable concepts include immutable revision IDs. Money uses decimal/numeric with documented precision, timestamps timezone-aware UTC, and state transitions optimistic versions. Required uniqueness includes provider fill identity, client order ID within adapter/account scope, journal source identity, consumer/event ID, candidate deduplication key, and job occurrence key. Foreign keys protect local relationships; flexible analysis payloads may use versioned JSON with application validation, not an unvalidated substitute for relational invariants.

Critical indexes support pending jobs/orders, portfolio/time, instrument/as-of, correlation ID, and outbox dispatch. Add partitions/indexes after representative workload evidence; do not promise scale without measurement. Schema migrations are versioned, reviewed, reversible where possible, and tested against existing fixtures. Expand/contract contracts when deployment versions overlap. Append-only application permissions protect journals/audit facts; database administrators remain trusted, so do not claim cryptographic tamper-proof storage.

## Analytical datasets — SETTLED Parquet + DuckDB

Adopted baseline paths partition by dataset/source/schema/date and use immutable manifest IDs, not a mutable “latest” folder as replay input. Manifest includes object list/hashes, schema, row counts, event/availability ranges, quality summaries, rights, transform/code versions, and superseded manifest reference. Stage files → validate → atomically publish manifest/reference; failed publication leaves unreferenced files eligible for audited cleanup. Database manifest registration is the discoverability point, avoiding a false distributed transaction between files and PostgreSQL.

DuckDB queries pinned read-only datasets for research, features where suitable, and evaluation. It does not update operational positions. Historical market bulk data lives in Parquet; operational snapshots reference it. Exports of Ledger facts are versioned analytical copies with source watermarks, never an alternative balance authority. Avoid concurrent writers to a shared DuckDB file; use independent analytical processes/connections and immutable Parquet inputs.

Start with filesystem-backed analytical storage for local work; durable object storage is a deployment recommendation, OD-13. Redis is conditional on measured need. Knowledge uses the adopted rights-aware versioned full-text-first design, initially compatible with PostgreSQL indexing; embeddings require measured material benefit. Cache eviction must never destroy sole copies of evidence or idempotency records.

## Retention, backups, and provenance

OD-10/13 decide retention, rights-driven deletion, backup target, restore objectives, and encryption/key custody. Preserve decision references, model outputs where permitted, policy/code versions, manifests, and simulator seeds for audit/replay. Restricted/deleted source content may require retained hash/metadata and a visible “evidence unavailable” limitation; do not promise exact replay after legally required deletion.

Coordinate PostgreSQL recovery point with referenced Parquet objects. Restore testing checks referenced manifests exist, outbox/inbox consistency, Ledger rebuild, and adapter reconciliation before execution resumes. Analytical retention cleanup walks live references and approved retention rules; never remove files still required by retained decisions. Store secrets outside tables, artifacts, browser bundles, logs, and version control; secret references may be configuration metadata.
