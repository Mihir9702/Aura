# ADR 0023: Local foundation implementation boundaries

Status: Accepted engineering choices under OD-01. Date: 2026-09-10.

The owner authorized implementation. Use the approved stack with Python 3.12, uv, SQLAlchemy/Alembic, Ruff/mypy and generated Pydantic/OpenAPI/TypeScript contracts. Run loopback API/Vite and PostgreSQL 17. Support Docker or isolated native Windows PostgreSQL; native was verified because Docker was unavailable. Existing database services are not repurposed.

The active challenge supports funding, reads and audited controls only. Order/fill fixture interfaces reject ACTIVE_PAPER. FIFO/fee-expensing/immediate settlement are named SHADOW test assumptions, not production policy. A global PostgreSQL gate serializes this foundation; finer scope locks await persisted qualification and measured needs.

SSE carries refresh invalidations, not authoritative cursor delivery. Durable outbox acknowledgement searches all unconsumed events, avoiding sequence/commit-order loss. The worker is not a trading scheduler. Alternatives that introduce an in-memory operational fallback, pretend registry entries are qualified Pods, or enable unapproved orders are rejected.

The foundation is runnable; full M0/M1 acceptance is incomplete. Full Kill re-arm fails closed until real dependencies are verifiable. Hosted authentication/CI, providers, qualified strategies, full accounting/replay, numeric limits and full acceptance suites remain pending. See [implementation status](../IMPLEMENTATION_STATUS.md). Original ADRs remain unchanged.
