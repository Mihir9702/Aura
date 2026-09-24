# Aura

A local, single-owner paper research workspace. The first runnable foundation includes an authenticated React UI, FastAPI, PostgreSQL Ledger, capability controls, generated contracts, and isolated accounting/recovery tests. **Observe only. No market/model/broker integration or order-submission API is enabled.**

## Start locally — Windows PowerShell

Requirements: Node 22.12+ or compatible newer Node, uv, and either Docker Desktop or PostgreSQL 17 binaries. This workspace was verified with native PostgreSQL 17 because Docker was unavailable.

```powershell
# PostgreSQL 17 installed at C:\Program Files\PostgreSQL\17\bin:
./scripts/bootstrap.ps1 -NativePostgres

# Alternatively, with Docker Desktop running:
./scripts/bootstrap.ps1

npm run dev
```

Open [Aura](http://127.0.0.1:5173). Sign in using `AURA_OWNER_KEY` from the generated local `.env`. The key is never printed by bootstrap or included in the frontend bundle. Keep `.env` private. Bootstrap is idempotent: it does not reset the $500 challenge or existing controls. Native setup creates an isolated cluster under `.cache/postgres` on loopback port 55432; existing PostgreSQL services are untouched.

`npm run dev` runs `scripts/dev.ps1`: it starts the configured local PostgreSQL setup, waits for API/database health, starts the worker, then runs Vite. Keep that terminal running. It stops its own API/worker processes when exited. Logs are in `.cache/api.stderr.log` and `.cache/worker.stderr.log`. Native PostgreSQL remains running. `npm run dev:web` starts only the frontend; if it is already running, `./scripts/dev.ps1 -BackendOnly` starts the missing backend alongside it. To stop only Aura's native cluster:

```powershell
& 'C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe' -D .cache/postgres -m fast -w stop
```

For Docker, `docker compose stop postgres` preserves the data volume. Do not delete data directories/volumes to resolve errors.

## Verify

```powershell
./scripts/check.ps1                # Ruff, mypy, domain tests, web build
./scripts/test-integration.ps1     # Resets only the dedicated aura_test fixture DB
./scripts/contracts.ps1            # Regenerate OpenAPI and TypeScript types
npm run test:e2e                   # Running API + Vite; installed Chrome required
uv run python scripts/backup_restore_check.py
```

The restore drill currently supports native PostgreSQL 17. It creates a new disposable restore database, verifies accounting, and removes only that database. Its private dump remains in ignored `.cache`; hosted backup/retention policy is not implemented. Integration tests never reset `aura`. Browser verification activates/releases Entry Halt and retains the audit records; it does not activate Full Kill.

## Working scope

- Overview, Portfolio/Ledger, all-five Pod registry, research readiness, health and owner controls.
- Server-side owner sessions, origin-protected commands, SSE invalidation plus authoritative refresh/polling.
- Once-only initial funding effect; balanced, append-only, transaction-sealed PostgreSQL journals.
- SHADOW-only fixture accounting: explicit FIFO/fee-expensing/immediate settlement, fractional fills, shared cash/exit reservations, identity conflicts, unknown-submit retention.
- Pure capacity-sizing, temporal-eligibility and lifecycle validators. These are not qualified strategies or the complete Risk Engine.
- Transactional outbox and durable competing-consumer inbox acknowledgement. The worker acknowledges facts; it does not execute trading or scheduled jobs.

All five methodologies remain **UNIMPLEMENTED**. This build cannot leave Observe. Full Kill persists; re-arm fails closed until real dependency/reconciliation checks exist. No adapter cancellation is claimed when no adapter exists. Fixture APIs are Python test interfaces and reject the active challenge.

M0/M1 are partially implemented, not completed milestones. Read [implementation status](docs/IMPLEMENTATION_STATUS.md) before expanding scope. Open providers, policies, corrections/replay/action accounting, qualified strategy persistence, scheduling, hosted auth and CI remain explicit work.

## Engineering map

`packages/aura/src/aura` holds explicit domain modules in one Python distribution. `apps/api` composes the API; `apps/web` contains React/TypeScript/Vite/Tailwind. `infra/migrations` contains forward-only SQL migrations. `packages/contracts/openapi.json` generates frontend types. `tests` covers domain, PostgreSQL and browser flows.

See [Design Bible](docs/design-bible/README.md), [ADRs](docs/adr/README.md), and [architecture status](docs/ARCHITECTURE_STATUS.md). Dependency versions are fixed in `uv.lock` and `package-lock.json`.

Implementation references: FastAPI [lifespan](https://fastapi.tiangolo.com/advanced/events/), SQLAlchemy [transactions](https://docs.sqlalchemy.org/en/20/orm/session_basics.html), and Vite [runtime prerequisites](https://vite.dev/guide/).
