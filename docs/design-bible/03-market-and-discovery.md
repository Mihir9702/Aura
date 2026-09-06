# Market platform, features, scanner, and Strategy Pods

## Data Engine

SETTLED responsibilities: ingest, normalize, validate, timestamp, deduplicate, cache, persist, and detect stale/broken feeds. Eventual sources include price/OHLCV/quotes, fundamentals/statements, earnings/guidance, news/releases/filings/transcripts, macro/rates/inflation/employment, indices/sectors, analyst changes, insider/institutional activity, options/volatility, and evaluated alternative data. A source is not an implemented integration merely because the architecture names it.

Adopted baseline adapter contract: capabilities, identity mapping, source timezone/calendar, revision policy, availability semantics, entitlement metadata, rate limits, quality status, and a recoverable cursor. Normalize into immutable observations; quarantine malformed, impossible, unordered, or untrusted identity records. Persist provider/raw hashes and original timestamps. Deduplicate by provider observation identity plus revision, not ticker and timestamp alone. Never overwrite a correction into an older decision's evidence.

Use stable instrument IDs with effective-dated symbols, listings, exchange, currency, and security type. Universe membership is itself point-in-time data, including delisted securities. Reject unknown identity mappings until resolved. Bar records define interval start/end and final/provisional state; only completed, available bars enter close-based features. Quotes define bid/ask sizes, event time, receive time, and feed status; crossed quotes are flagged rather than used for optimistic fills.

Historical access enforces `event_time <= as_of` **and** `available_at <= knowledge_cutoff`. For live data, availability is no earlier than ingestion/validation. For imported history, distinguish vendor-provided historical publication time from import time; absent trustworthy availability, mark the limitation and disallow causal claims that require it. Restated fundamentals, revised macro series, and adjusted prices are versioned. Corporate-action adjustments must not insert future knowledge into features; raw execution prices and adjustment factors are separate.

Quality is dimensioned by source, instrument, field, and intended horizon: freshness, completeness, duplicate rate, sequence gaps, clock skew, and semantic validity. Missing values are explicit, not zero. Reconnect backfills gaps before affected features resume. Staleness thresholds, provider selection, session coverage, and initial source set are OD-02/03/04. Safety uses approved thresholds; no arbitrary runtime fallback.

## Feature Engine

Deterministic versioned functions compute returns, volatility, ATR, RSI, moving averages, relative volume, VWAP relationships, relative strength, spreads, liquidity, trend, and regime measurements where enabled. Each definition records units, sampling interval, warm-up history, price adjustment policy, missing-data policy, calendar, dependency versions, and precision. A snapshot pins data manifest, cutoff, computed time, definition version, and quality flags. Unavailable warm-up yields NOT_READY, not a fabricated feature.

Feature caching keys include instrument, as-of cutoff, data revisions, definition version, and horizon. A new revision yields a new snapshot; historical proposals retain old snapshots. Backtests and paper operation call the same feature/Pod domain logic with different clock/data ports. Live model responses are recorded, not reproducible by assumption.

## Scanner and Strategy Pods

Scanner owns opportunity filtering/routing and candidate intake; Strategies owns Pod logic, versions and qualification. Scanner stages: point-in-time universe → eligibility/quality gates → inexpensive quantitative screens → bounded Pod evaluation → candidate deduplication/ranking → deep-analysis budget. Scanner records passed and failed reasons and counts so a quiet portfolio is explainable. Avoid an LLM call per ticker. The five Pod names are settled; candidate ranking policy, implementation priority, exact methodology rules and thresholds remain OD-03/08.

A Pod specification contains ID/version, hypothesis, instrument eligibility, horizon, feature requirements, deterministic signal rules, evidence requests, entry assumptions, invalidation/exit rules, cooldown and expiry, and experiment provenance. Momentum, Breakout, Event / Catalyst, Mean Reversion, and Swing Trend are the five settled named Pods. The initial comprehensive implementation structurally supports all five, with implementation and qualification tracked separately. See [Strategies and Regime](17-strategies-and-regime.md). A Pod can use validated text-derived signals through explicit inputs; it cannot obtain execution authority by calling an AI role.

Pod output is a candidate with immutable thesis intent, snapshot references, causal trigger, and deduplication key `(pod_version, parameter_hash, horizon_spec_version, strategy_scope_id, instrument_id, direction, signal_window, trigger_revision)`. Repeated identical discovery attaches observations to the same candidate; materially new evidence produces a new revision/run. Different Pods may independently suggest the same instrument; Portfolio Manager resolves shared exposure, not candidate deduplication. Pod versions cannot be mutated while in use.

## Candidate lifecycle

Adopted baseline states: DISCOVERED → TRIAGED → ANALYZING → PROPOSED; any pre-proposal state may end FILTERED, EXPIRED, or FAILED. FILTERED is an intentional policy outcome, FAILED a technical outcome. Retries keep attempt records and an idempotent analysis-run key. Each transition uses expected version and records actor, reason, event, and time.

Triage binds quality, priority, deadline, and analysis budget. Stale candidates expire before model dispatch and again before proposal acceptance. A candidate can have several immutable proposal revisions, but only one current executable revision; supersession invalidates older approvals. PROPOSED does not imply risk acceptance, capital, or execution. No-trade adjudications record a terminal FILTERED outcome and reasoning. Technical model failure never becomes a silent positive decision.
