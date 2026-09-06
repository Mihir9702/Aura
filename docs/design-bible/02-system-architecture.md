# System context and logical architecture

## Boundaries — SETTLED

An authenticated web client interacts with the FastAPI backend. External dependencies are market/information providers, model providers, legally usable reference documents, and a paper broker or simulator. PostgreSQL holds operational truth; analytical datasets use Parquet queried with DuckDB. Initial deployment is a modular monolith, with optional worker processes from the same codebase. No event broker, Redis, vector database, or service mesh is required initially.

The consequential path is data → features (with deterministic Regime Engine snapshots) → scanner → Strategy Pods → candidates → selective Committee → Trade Proposal → Portfolio Manager → mode authorization → deterministic Risk Engine → Order Manager → Broker Interface → Paper Broker Adapter → fills → Portfolio Ledger. Position Monitor creates Exit Proposals that rejoin the same portfolio/mode/risk/order path. Shadow and research execution are isolated from active paper execution.

## Ownership — adopted baseline

| Module | Owns | Cannot own or do |
|---|---|---|
| Data | Provider adapters, normalization, quality, identity mappings, manifests | Decide trades or revise historical availability silently |
| Features | Versioned feature definitions and immutable snapshots | Infer numerical facts with LLMs |
| Discovery | Scanner, opportunity routing, candidate intake/deduplication/triage | Own Pod methodologies or allocate capital |
| Strategies | Five named Pod methodologies/versions, eligibility status, qualification/activation records | Submit orders or promote from scores automatically |
| Regime | Deterministic market-wide regime definitions/snapshots and quality | Use LLM description as canonical state or adapt allocation without qualification |
| Intelligence | Committee runs, analyses, adjudication, Model Router | Read secrets, mutate policies, call broker |
| Knowledge | Licensed documents, versions, retrieval citations | Treat reference assertions as validated alpha |
| Portfolio | Allocation intents, competing opportunity selection | Authoritative cash/positions or independent fills |
| Risk | Policy versions, decisions, reservations, authorization checks | Rewrite thesis or choose another security |
| Execution | Order Manager, adapter protocol, order/fill receipt states | Book balances independently |
| Ledger | Immutable journals, lots, balances, position projections | Create fictitious execution facts to repair discrepancies |
| Monitoring | Thesis timers, deterministic triggers, exit proposals | Direct execution or horizon extensions |
| Research | Experiments, shadow ledgers, backtests, League evaluations | Promote itself or touch active-paper reservations |
| Orchestration | Durable jobs, schedules, deadlines, retries | Embed trading policy |
| Operations | Component Health Gates, Entry Halt / Full Kill controls, incident/recovery records | Erase audit history or bypass risk |
| Reporting/API | Authorized queries, reports, user commands | Direct module-table writes or recomputed accounting truth |

Each module exposes typed application interfaces. Domain logic is independent of FastAPI, storage drivers, models, and vendor SDKs. Infrastructure implements ports. Modules own tables through repositories; cross-module reads use declared query interfaces or read projections, never opportunistic mutation. Stable identifiers cross boundaries; domain objects do not become a shared giant mutable model.

## Transaction and authority boundaries

A workflow application service may coordinate several module interfaces inside one PostgreSQL transaction. This is intentional modular-monolith atomicity, not permission for repositories to reach into other modules. The critical gate transaction locks applicable global controls, portfolio execution gate and sorted strategy eligibility scopes in the documented order, checks portfolio/policy/mode/health/control and entry qualification versions, obtains a Risk Decision, reserves capacity, creates an authorized order intent, and writes its outbox events. PostgreSQL commits these together. Ledger posting similarly commits journal, fill application, position version, and outbox together.

Network calls occur outside database transactions. The submit protocol in [execution](06-execution-and-accounting.md) handles the resulting gap with a durable intent, unique client order identity, and reconciliation. Outbox delivery is at least once; consumer effects are idempotent. An event is a fact, not permission: receiving RISK_APPROVED alone cannot submit an order.

FastAPI request handlers accept commands or return read models; long scans, AI calls, imports, and research jobs are durable jobs. UI receives progress through a versioned SSE update channel, with polling fallback and authoritative refresh after reconnect. Research workloads are resource-limited independently of monitoring even if deployed on one host.

## Extraction rule

Extract a service only after measured scaling, isolation, security, or team-ownership pressure defeats a simpler process boundary. Preserve contracts and transactional semantics or replace them with explicitly reviewed consistency protocols. First likely separate processes are analytical workers, not independent trading microservices. Single-owner local Windows-friendly development and authenticated single-owner hosted API/worker roles are settled. Hosting/auth implementation and exact dependency versions remain open or M0 technical choices in OD-13; the monolith-first direction and tooling direction are approved.

Strategies exposes the same versioned Pod evaluation interface to Discovery and Research. Regime is a first-class domain using Features/Data ports; it does not own raw feeds or allocation. All active Pods share one portfolio's cash and reservation gate. Entry admission validates current strategy qualification/activation and capability control generation, not an eventually consistent status event.
