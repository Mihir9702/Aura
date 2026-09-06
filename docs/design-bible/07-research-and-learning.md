# Shadow Portfolios, Research League, and learning

## Shadow Portfolios — SETTLED concept

Maintain counterfactual portfolios for rejected opportunities, individual Pods, and alternative decisions. They measure rejected opportunities, guardrail effects, strategy differences, and cash opportunity cost. They cannot submit active paper orders or consume active reservations.

Adopted baseline: each shadow has its own portfolio ID, capital baseline, decision-policy version, simulator version, costs, universe, calendar, and inclusion rule registered **before** outcomes. It reuses Ledger invariants in an isolated namespace. Create a ShadowTrade from the decision-time proposal and market snapshot, including actual rejection stage/reason. Missing entry/exit specifications make a shadow unevaluable; do not backfill a winning rule after observing returns.

Distinguish unconstrained per-opportunity diagnostic returns from capital-constrained portfolio results. Mutually exclusive opportunities cannot all spend the same cash. Counterfactual allocation needs ordering, capacity, and exit rules; use equal data, costs, and horizons for controlled comparisons. Log which candidates were never shadowed due to budget/sampling, and preserve inclusion probabilities where applicable. “Rejected trades did well” alone is not causal evidence against risk controls.

## Backtesting architecture

Adopted baseline pipeline: frozen experiment specification → point-in-time universe/data manifest → deterministic clock/event replay → shared feature/Pod/portfolio/risk logic → isolated simulator/ledger → metrics with uncertainty → stored evaluation. A backtest has no path to the active adapter. Pin source revisions, code commit, parameters, random seed, policy versions, fees/slippage/latency, benchmark, and metric implementation version.

Enforce knowledge cutoffs, completed bars, effective-dated listings, delistings, publication delays, restatements, and corporate actions. Use chronological train/validation/holdout splits, walk-forward testing, and purge/embargo rules when labels overlap horizons. Record every tried configuration to expose multiple-testing/selection effects; do not repeatedly tune on the final holdout. Include stress regimes and capacity/turnover sensitivity. Historical LLM contamination remains a limitation even with retrieval cutoffs; use prospective paper evaluation to validate AI value.

## Research League — offline evaluation and governance

SETTLED: evaluate beyond raw profit. Candidate metrics include return, expected value, Sharpe, Sortino, profit factor, drawdown, consistency, sample size, regime performance, and risk-adjusted return. AI roles use calibration, classification accuracy, thesis quality, false positives, predictive value, and downstream usefulness.

Adopted baseline metric specification records formula/version, net/gross basis, sampling frequency, annualization convention, risk-free assumption, benchmark, capital flows, confidence intervals, and effective sample size. Undefined metrics (zero downside variance, no losses, insufficient samples) are null with reasons, not infinity or top rank. Mark-to-market return series and drawdowns use consistent valuation/session conventions. Overlapping trades/regimes reduce independence; report uncertainty rather than treating trade count as independent samples. Risk profiles, leverage, capital, market period, and costs must match or be stratified before ranking.

Role evaluation separates factual/citation correctness, output validity, uncertainty/calibration against resolved labels, and downstream ablation impact. Compare a deterministic baseline and no-AI workflow. A role's profitable recommendation is not sufficient evidence of its causal usefulness. Promotion thresholds and primary ranking criteria remain OD-08/15.

## Controlled learning

SETTLED progression: Knowledge → Hypothesis → Backtest → Out-of-sample validation → Paper experiment → Evidence → Strategy evaluation. Adopted baseline states: DRAFT → REGISTERED → BACKTESTED → VALIDATED → PAPER_RUNNING → EVALUATED → PROPOSED_FOR_PROMOTION → OWNER_APPROVED/REJECTED. Any stage may fail with a recorded reason. Approval creates a versioned configuration/code change through normal review and regression gates; it never grants a model deployment privileges.

Experiments specify falsifiable claim, baseline, metrics, sample/window, termination criteria, data access, budget, safety constraints, and preregistration time. Concurrent experiments have isolated allocations and resource ceilings. Store negative/inconclusive findings in Knowledge Library with provenance. Do not change evaluation rules mid-run without starting a new experiment revision. Regime-adaptive exposure and alternative-data signals remain EXPERIMENTAL until explicit promotion.

Research cost is bounded by manifest storage, worker concurrency, data scan limits, AI budgets, and shadow sampling. A failed research job must not delay position monitoring or accounting. OD-15 decides initial research scope and required evidence; no fabricated sample-size threshold is settled here.

## Settled scorecard and authority boundary

League and agent/strategy scorecards operate offline. They never directly authorize orders, promote Pods, or provide a raw reward that strategies optimize by increasing risk. An immutable EvaluationResult may support a reviewed qualification/allocation policy proposal; only an explicitly versioned owner-approved policy can later affect eligibility/allocation, and all ordinary risk/execution gates remain. Avoid a live score-to-weight feedback channel.

Required scorecard concepts: total/net return, benchmark-relative return, maximum drawdown, expectancy, profit factor where defined, Sharpe/Sortino when statistically appropriate, turnover/costs, sample/effective sample, uncertainty intervals where appropriate, regime breakdown, calibration for probabilistic AI outputs, no-AI/quant-only baselines and Shadow Portfolio comparisons. Exact thresholds/benchmarks/windows remain OD-15. Use the frozen decision-time RegimeSnapshot for causal stratification; a retrospective regime analysis is labeled separately and cannot qualify earlier decisions using future knowledge.

Strategies, not Research, owns qualification/activation records. Research stores evidence and requests review. Shared Pod/Regime ports guarantee version identity across backtest, shadow and active workflows. Each Pod version/horizon/scope qualifies independently; a winning aggregate score cannot qualify another horizon or relax portfolio limits.
