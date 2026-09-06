# ADR 0017: Deterministic Market Regime Engine

Status: **Accepted — SETTLED by product owner**. Date: 2026-09-05.

## Context and history

Adds explicit regime ownership to the feature/data architecture; preserves ADR-0008 deterministic risk authority.

## Decision

Use deterministic versioned market-wide trend, volatility, breadth, sector dispersion, liquidity and approved macro context. Immutable causal snapshots are evidence for Pods/Committee; no LLM subjective canonical state.

## Alternatives

A narrative market label is not a reproducible estimator. Fitted deterministic classifiers are possible only with causal training/validation; taxonomy/thresholds remain OD-17.

## Consequences and remaining decisions

Regime state does not grant allocation authority. Adaptive risk/capital remains EXPERIMENTAL until empirical qualification and explicit versioned owner approval.

Authority: [owner refinement record](../design-bible/18-owner-decisions.md). Parameter status: [Open Decisions](../design-bible/15-open-decisions.md). Original ADR-0001–0014 remain unchanged; historical “unresolved details” in those records are interpreted using this amendment series and the current register.
