# Proposed repository and implementation plan

**Adopted direction; no application directories or commands below exist yet.** OD-01 is approved with amendments. This run creates documentation only. A subsequent implementation prompt and slice-specific decisions gate coding; do not interpret a directory sketch as an implemented subsystem.

## Monorepo layout

```
Aura/
  AGENTS.md
  Aura_Seed.md
  docs/                         # Design Bible, ADRs, Mermaid, status
  apps/
    api/                        # FastAPI bootstrap, auth, routes, dependency wiring
    worker/                     # Job/scheduler entrypoints; same backend package
    web/                        # React/TS/Vite routes, feature views, design tokens
  packages/
    aura/                       # One installable Python distribution initially
      src/aura/
        common/                 # IDs, clock, decimal types, errors; no trading policy
        data/ features/ regime/ strategies/ discovery/
        intelligence/ knowledge/
        portfolio/ risk/ execution/ ledger/ monitoring/
        research/ orchestration/ operations/ reporting/
      tests/                    # Python module unit tests
    contracts/                  # Reviewed JSON Schema/OpenAPI artifacts and fixtures
  tests/
    integration/ contracts/ accounting/ replay/ failure/
    backtest/ ai_eval/ e2e/      # Cross-module and browser/system verification
  data/
    raw/ curated/ manifests/ artifacts/ scratch/  # Ignored runtime data
    fixtures/                   # Small licensed synthetic or permitted test fixtures
  scripts/                      # Bootstrap, checks, migrations, replay, reconciliation
  infra/                        # Local services, deployment, backup/restore definitions
  config/                       # Nonsecret schema, example config, approved policies
  pyproject.toml               # Python dependency/tool configuration once selected
  package.json                # Web/tooling scripts once selected
```

Each Python module separates domain, application, ports, and infrastructure only as complexity warrants; do not create empty abstraction layers merely to match a template. One Python package avoids premature packaging/dependency releases. `apps` wire dependencies and host processes; they do not duplicate module logic. Pod implementations and qualification/activation ownership live in strategies; Discovery scans/routes and accepts candidates. Regime owns deterministic market-wide snapshots. Research and active workflows invoke the same versioned strategies/regime ports; AI roles live in intelligence.

Shared contracts define external/API/event boundaries, not shared mutable ORM models. Use backend-owned typed schemas exporting OpenAPI/JSON Schema and a generated TypeScript client, with drift checks. Domain and database models need not equal wire schemas. Exact contract generator/validation library is an M0 technical selection under adopted OD-01. Decimal values cross JSON as strings. Web code has no direct database/model-provider/broker access.

## Tooling and local development

SETTLED stack: Python/FastAPI; React/TypeScript/Vite/Tailwind/shadcn where appropriate; PostgreSQL; Parquet/DuckDB. Optional quantitative libraries are NumPy, Polars or pandas, SciPy, scikit-learn, statsmodels, and PyArrow when needed. Do not install all of them by default. Tooling direction is adopted below; exact versions, type checker/schema generator and job implementation details are M0 technical selections. Auth implementation and hosting remain OD-13.

Adopted tooling direction: uv for Python, npm for web, pytest for Python tests, Ruff plus a selected type checker, SQLAlchemy/Alembic for persistence, Vitest/Testing Library for web units, Playwright for browser flows. These directions are approved, but no installed or compatibility-verified versions are claimed. Pin supported versions/lockfiles during the authorized bootstrap and consult primary documentation then.

Future command convention (to implement and document in M0): `scripts/bootstrap`, `scripts/dev`, `scripts/check`, `scripts/test-integration`, `scripts/test-accounting`, `scripts/test-replay`, `scripts/test-e2e`, `scripts/evaluate-ai`, and `scripts/backup-restore-check`. Implement Windows-friendly PowerShell or cross-platform entrypoints during M0; do not assume POSIX-only commands. **These are command names to define, not runnable instructions.** No npm/Python test or build has been run because no application exists.

Local setup should validate prerequisites, start PostgreSQL, apply migrations, load synthetic fixtures, start API/worker/web, and default to Observe with paper credentials absent. `.env.example` documents names without values; actual secrets live outside version control. Nonsecret settings and policies are versioned, validated, and auditable. Separate data roots/IDs keep tests and research out of active-paper state. Never commit user documents, bulk market data, logs, secrets, or generated private artifacts.

## Milestones and acceptance gates

| Milestone | Deliverable | Gate to enter / evidence to finish |
|---|---|---|
| M0 Foundations | Authorized repo bootstrap, module boundaries, contract generation, config, DB/jobs, auth skeleton, CI | OD-01 and local single-owner direction already adopted; subsequent implementation prompt required; checks run; migration/restore smoke; paper-only negative tests |
| M1 Accounting and replay | Ledger, lots, deterministic simulator port, unique events/receipts, reservations, unknown-submit recovery, Entry Halt/Full Kill/health gates | Settled 500.00 USD/LONG-only/fractional/control boundaries; labeled fixture assumptions for residual OD-05/11/12; fractional accounting/invariants and crash/concurrency tests pass |
| M2 Observe vertical slice | Qualified market source → features/regime → a first Pod → candidate → Committee → proposal/risk preview → UI/audit | OD-02/03/04/08/09/14 relevant values approved; point-in-time and injection tests; real declared provider slice, execution disabled |
| M3 Assisted Paper | Approval, final risk, paper orders/partial fills, monitoring/exits, reconciliation | Residual OD-05/06/07/11/12 and OD-15 qualification criteria approved for enabled scope; fault tests and full entry/exit evidence; no unresolved Ledger differences |
| M4 Autonomous Paper | Same path with autonomous mode permission, durable schedules, operational reports | M3 evidence; explicit owner activation policy; unattended recovery and budget/health tests; no silent mode escalation |
| M5 Research breadth | Shadows, League, backtests, Knowledge retrieval, experiments and promotion review | Residual OD-10/15 approved; fair comparisons, bias tests, uncertainty and negative results retained |
| M6 Coherent alpha | All-five Pod structural support with implementation and per-horizon qualification status explicit, polished views/reports, operations handoff | Relevant open decisions closed; measured cost/latency/capacity; restore drill and security review; release scope documented |

Research foundations can develop alongside earlier milestones after their decisions, but research completion is required for a comprehensive alpha. A milestone is not a product release by itself. Each slice must state integration status (unimplemented, fixture-only, qualified, enabled) and demonstrate end-to-end data lineage. Do not mark M2 complete with fabricated provider data presented as live ingestion.

## Definition of done

For each implemented slice: approved relevant policy; working declared integrations; positive/negative contracts; critical invariants and recovery tests; observable failure states; documentation/diagrams in sync; reproducible setup; security and cost limits; limitations visible. For alpha: all required product concepts have an honest implemented or explicitly deferred scope approved by the owner. There are no live-money capabilities. Formal releases wait for coherent acceptance, not file count.

## What may safely be deferred during M0/M1

M0 may build module boundaries including strategies/regime, all-five registry/status contracts, SSE plumbing, local single-owner configuration and Windows-friendly commands under the approved tooling direction. M1 may implement 500.00 USD funding, capital-independent/fractional journal invariants, shared reservations, qualification gates and Entry Halt/Full Kill using explicitly labeled synthetic fixtures. All generated implementations stay Observe/non-submitting until the relevant policies are approved.

Market/news/paper/model/hosting vendors, API prices, paid budgets, UI screenshots, full corpus rights, exact production schedules, regime classification thresholds and qualification thresholds can be deferred while these foundations are built. Residual accounting/order policies may be represented as explicit mandatory configuration or alternative test fixtures; do not silently choose a production settlement, fee, precision, minimum-order or lot policy. Local auth safety cannot be omitted, though hosted auth/vendor selection can wait. Select compatible tool/runtime versions and document them in M0 rather than reopening the approved direction.

Before M3, build the minimum research/qualification vertical slice needed for that exact Pod/horizon; full League/Knowledge breadth in M5 is not a prerequisite for implementing the qualification mechanism, but evidence and approved qualification criteria are prerequisites for active entries. This avoids a milestone dependency cycle. Each Pod/horizon may qualify at a different time; M6 must honestly show all five implementation/qualification states, not label unqualified code as active capability.
