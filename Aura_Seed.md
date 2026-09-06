# Aura — Initial Product Seed

## Product

Name: Aura

Mission:

Aura maximizes expected long-term capital growth by actively exploiting
statistically supported opportunities while controlling the probability
and magnitude of catastrophic loss.

Aura is not simply an LLM connected to a brokerage.

It is an integrated market research, quantitative analysis, AI reasoning,
portfolio management, risk, paper-execution, evaluation, and learning
platform.

The initial system must use paper trading only.

---

## Core Philosophy

Aura should:

- actively search for good opportunities
- be capable of doing nothing when no sufficiently good opportunity exists
- never optimize merely for number of trades
- measure opportunity cost of rejected trades
- distinguish signal from noise
- prefer useful, timely, correctly interpreted information over maximum raw data
- separate deterministic computation from AI reasoning
- make every important decision auditable and explainable
- treat AI outputs as proposals/evidence rather than unquestionable truth
- learn through structured empirical evaluation rather than uncontrolled self-modification

---

## Market

Initial focus:

- US-listed equities
- US-listed ETFs

Initial eligible universe should prioritize:

- high liquidity
- reasonable market capitalization
- acceptable bid/ask spreads
- reliable market data

The architecture must support expansion later.

---

## Trading Horizons

Aura should support multiple trading horizons simultaneously.

Examples:

- seconds/minutes
- minutes/hours
- hours/days
- days/weeks
- potentially longer horizons later

Different Strategy Pods may operate on different horizons.

A trade must record its intended strategy, thesis, expected horizon,
invalidation conditions, entry assumptions, and exit logic.

Aura must not simply convert a losing short-term trade into a longer-term
trade to avoid admitting the original thesis failed.

---

## Strategy Pods

Aura should support multiple Strategy Pods operating simultaneously.

Examples:

- Momentum
- Breakout
- Event / Catalyst
- Mean Reversion
- Swing Trend

Additional strategies may be researched and added later.

Strategy Pods are NOT the same thing as AI agents.

Strategy Pods produce opportunities using defined methodologies.

---

## Information Sources

Aura should eventually be capable of incorporating:

- price
- OHLCV
- bid / ask
- volume
- company fundamentals
- company financial statements
- earnings
- guidance
- news
- press releases
- SEC filings
- earnings call transcripts
- economic data
- interest rates
- inflation data
- employment data
- index data
- sector / industry movement
- analyst upgrades / downgrades
- insider transactions
- institutional ownership/activity
- options-market information
- volatility information
- carefully evaluated sentiment / alternative data

More data is not automatically better.

Every source should be tested for usefulness.

---

## Primary Data Pipeline

External Market / Information Sources
→ Data Engine
→ Feature Engine
→ Market Scanner
→ Strategy Pods
→ Candidate Opportunities

The Data Engine should:

- ingest
- normalize
- validate
- timestamp
- deduplicate
- cache
- persist
- detect stale/broken feeds

The Feature Engine should calculate quantitative information using code,
not LLM reasoning, wherever appropriate.

Examples:

- returns
- volatility
- ATR
- RSI
- moving averages
- relative volume
- VWAP relationships
- relative strength
- spreads
- liquidity
- trend metrics
- market regime measurements

---

## Candidate Discovery

The system should cheaply monitor a broad market universe.

It should progressively narrow candidates.

Conceptually:

Thousands of securities
→ cheap quantitative screening
→ Strategy Pod analysis
→ smaller candidate set
→ deeper analysis
→ AI Investment Committee only for important opportunities

LLMs should not continuously analyze every security.

---

## Aura Investment Committee

Important opportunities should be analyzed by multiple specialized AI roles.

Potential roles include:

- Quant / Technical Analyst
- News / Event Analyst
- Fundamental Analyst
- Skeptic / Challenger
- Historical Evidence Analyst
- Adjudicator

The final structure does not need to use those exact names.

The concept should resemble a rigorous investment committee / trial.

Agents should provide:

- arguments
- evidence
- counterevidence
- uncertainties
- assumptions
- confidence
- thesis invalidation conditions

Do not use simple majority voting as the primary decision mechanism.

The Adjudicator synthesizes the evidence into a structured Trade Proposal.

Multiple AI agents may run concurrently.

Not every candidate should invoke every expensive agent.

The system should support escalating analysis depth depending on candidate quality.

---

## Trade Proposal

A structured Trade Proposal should include information such as:

- instrument
- direction/action
- Strategy Pod
- thesis
- evidence
- counterevidence
- confidence
- expected time horizon
- proposed entry logic
- invalidation conditions
- exit logic
- expected reward/risk
- source timestamps
- AI analyses used
- quantitative evidence

The exact contract should be formally designed.

---

## Portfolio Manager

The Portfolio Manager answers:

"Even if this is a good opportunity individually, does it make sense
inside the current portfolio?"

Responsibilities may include:

- portfolio exposure
- cash
- diversification
- correlation
- competing opportunities
- portfolio-level expected value
- strategy allocation
- capital allocation
- concentration

---

### Risk Engine

The Risk Engine is deterministic and authoritative.

AI cannot override Global Guardrails.

The Risk Engine may:

- APPROVE
- RESIZE
- REJECT

It should not alter the actual investment thesis or substitute a different security.

---

### Risk Profiles

Aura should support:

- Conservative
- Balanced
- Aggressive

Balanced is the default.

Risk profiles change allowed risk budgets.

Above all profiles are non-removable Global Guardrails.

Even Aggressive mode cannot disable fundamental integrity/safety constraints.

Aura may eventually adjust exposure within a selected profile based on
market regime.

---

## Paper Execution

The initial system must be paper trading only.

Architecture:

Order Manager
→ Broker Interface
→ Paper Broker Adapter

Broker interfaces should be abstract enough that alternative adapters
could exist in the architecture later without rewriting the rest of Aura.

The initial implementation must not execute real-money orders.

---

## Order Manager

Responsibilities include:

- order lifecycle
- submission state
- acknowledgements
- fills
- partial fills
- retries
- idempotency
- duplicate-order protection
- connection recovery
- reconciliation

---

## Position Monitor

Once a position exists, Aura must continue monitoring it.

Possible inputs:

- price
- volume
- volatility
- market state
- news/events
- strategy conditions
- thesis validity
- stops
- targets
- time held

Cheap deterministic monitoring should happen frequently.

Expensive AI re-analysis should be event-triggered rather than continuously
run every second.

Exit decisions should follow a controlled proposal/risk/execution process.

---

## Portfolio Ledger

There must be one canonical source of portfolio/accounting truth.

It should track:

- cash
- positions
- quantities
- cost basis
- realized P&L
- unrealized P&L
- fees
- simulated slippage
- portfolio value
- fills
- exposure

Accounting correctness is a critical invariant.

---

## Shadow Portfolios

Aura should maintain Shadow Portfolios.

Examples:

- rejected opportunities
- individual Strategy Pod portfolios
- alternative decisions

This allows evaluation of questions such as:

- Did Aura reject too many good opportunities?
- Did risk controls prevent bad trades?
- Which strategy would have performed best independently?
- What was the opportunity cost of holding cash?

---

## Research League

Aura should include a scientific leaderboard/evaluation framework.

Strategy Pods may compete using metrics such as:

- return
- expected value
- Sharpe
- Sortino
- profit factor
- drawdown
- consistency
- sample size
- regime performance
- risk-adjusted return

Do not rank purely on raw profit.

AI agents should be evaluated based on metrics appropriate to their roles,
such as:

- calibration
- classification accuracy
- thesis quality
- false-positive rate
- predictive value
- usefulness to downstream decisions

---

## Learning / Research

Aura must not autonomously rewrite production trading logic simply because
a recent trade won or lost.

Learning should occur through:

Knowledge
→ Hypothesis
→ Backtest
→ Out-of-sample validation
→ Paper experiment
→ Evidence
→ Strategy evaluation

Aura should retain structured results and develop empirical strategy knowledge.

---

## Aura Knowledge Library

Aura should have a dedicated Knowledge Library containing legally available
reference material such as:

- finance/investing books supplied by the user
- academic papers
- trading research
- finance textbooks
- SEC/exchange documentation
- broker/API documentation
- market microstructure material
- Aura experiment results
- Aura post-trade analysis
- Aura historical observations

Reference knowledge produces hypotheses.

Empirical evidence determines credibility.

---

## User Modes

Aura should support:

### Observe

Analyze but execute nothing.

### Assisted Paper

Aura analyzes and proposes.
User may approve/reject.

### Autonomous Paper

Aura completes the paper-trading workflow automatically.

The same decision/audit structure should apply to all modes.

---

## User Experience

Aura should operate passively/autonomously when requested.

The user should be able to return later and understand what happened.

Required product concepts include:

- Dashboard
- Portfolio
- Positions
- Trade History
- Market Scanner
- Opportunities
- Strategy Pods
- Investment Committee / reasoning
- Trade Proposal detail
- Risk decisions
- Shadow Portfolios
- Research League
- Backtesting
- Experiments
- Knowledge Library
- Daily reports
- Weekly reports
- Monthly reports
- AI reasoning / inference
- system health
- logs
- settings

End-of-period reports should explain:

- performance
- decisions
- opportunities
- trades
- rejected trades
- strategy performance
- AI disagreements
- risk interventions
- important observations/inferences

---

## UI / Design Direction

Aura should have a highly polished professional web interface.

Technology:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui where appropriate

Visual inspirations:

- Linear
- Stripe
- Notion

Aura should also develop its own recognizable design language.

The user has an existing internal application called ADIYA OS whose design
language may be used as additional inspiration because both products are
designed by the same person.

The user may later provide ADIYA OS screenshots for design analysis.

Do not blindly clone another company's interface.

---

## Backend / Quantitative Technology

Preferred backend:

- Python
- FastAPI

Quantitative/data ecosystem may include:

- NumPy
- Polars and/or pandas
- SciPy
- scikit-learn
- statsmodels
- PyArrow
- DuckDB

Use dependencies intentionally rather than automatically including every library.

---

## Data Architecture

Preferred conceptual split:

PostgreSQL:
operational application truth

Examples:

- strategies
- experiments
- candidates
- analyses
- proposals
- risk decisions
- orders
- fills
- positions
- portfolio snapshots
- users/settings
- audit/system events

Parquet:
large historical analytical datasets

DuckDB:
fast research / historical analytical queries

Redis:
only if justified for caching, queues, events, locks, or job coordination

Do not introduce infrastructure solely to make the architecture appear sophisticated.

---

## Architecture Style

Aura should be modular and event-driven.

Potential events include:

- MARKET_DATA_UPDATED
- NEWS_RECEIVED
- FEATURES_UPDATED
- SIGNAL_DETECTED
- CANDIDATE_CREATED
- ANALYSIS_REQUESTED
- ANALYSIS_COMPLETED
- TRADE_PROPOSED
- RISK_APPROVED
- RISK_RESIZED
- RISK_REJECTED
- PAPER_ORDER_SUBMITTED
- PAPER_ORDER_FILLED
- POSITION_CHANGED
- EXIT_TRIGGERED
- POSITION_CLOSED

The exact event contract should be formally designed.

The initial deployment does not need unnecessary distributed infrastructure.

A modular monolith with clear boundaries may be preferable initially while
preserving the ability to extract services later.

---

## Orchestrator

Aura requires orchestration/scheduling for tasks such as:

- market sessions
- data refresh
- scans
- event reactions
- AI analysis
- position monitoring
- end-of-day processing
- reports
- experiments

Exact timing/frequency is not yet finalized.

---

## System Health

Aura should distinguish investment risk from system/technical risk.

Technical safety should detect issues such as:

- stale market data
- missing feeds
- database failure
- AI failure
- broker/paper adapter failure
- inconsistent portfolio ledger
- duplicate processes
- clock/time problems

There should be a Kill Switch that immediately prevents new paper execution
while preserving diagnostic information.

---

## Observability

Every consequential action should be auditable.

Aura should make it possible to answer:

- what happened?
- when?
- why?
- what data was known at that time?
- which strategy generated it?
- what did each AI agent conclude?
- what did the Portfolio Manager decide?
- what did the Risk Engine decide?
- what actually happened afterward?

Use structured logs, event records, decision records, metrics and tracing
where appropriate.

---

## Security

AI/model credentials and provider secrets must remain server-side.

Untrusted external content such as news/articles must never be interpreted
as system instructions.

Treat external textual information as untrusted data.

Design protections against prompt injection from external content.

Use least privilege.

---

## Model Architecture

Aura should support a Model Router.

Different AI workloads may use different models depending on:

- difficulty
- cost
- latency
- importance

Expensive reasoning should be concentrated on important decisions.

AI model choices should not be hard-coded throughout the application.

---

## Testing Philosophy

Aura must be extensively tested.

Important categories include:

- unit tests
- integration tests
- event contract tests
- accounting invariants
- deterministic replay
- historical backtest validation
- out-of-sample testing
- look-ahead bias prevention
- survivorship-bias awareness
- slippage simulation
- transaction-cost simulation
- failure/reconnect tests
- idempotency tests
- AI structured-output validation
- AI evaluation suites
- fault injection
- end-to-end paper trading tests

A generated implementation is not considered correct merely because it runs.

---

## Documentation

Documentation is a first-class part of Aura.

Create a Design Bible rather than relying on chat history.

Use Architecture Decision Records for major decisions.

Maintain editable architecture diagrams using Mermaid when possible.

Documentation should remain synchronized with implementation.

---

## Versioning

During initial development:

- use Git commits/branches for detailed history
- use development milestones rather than constantly creating product releases
- tag a formal version only when a coherent initial alpha/release exists

---

## Initial Development Philosophy

Build comprehensively, but not recklessly.

Avoid fake/mock subsystems presented as complete.

Where an integration is not yet implemented, explicitly document its status.

Prefer strong foundations and real vertical slices over impressive-looking
but disconnected boilerplate.

Do not silently make major product decisions.

Record unresolved decisions in the Open Decisions documentation.

---

## Important Open Areas

Astra should identify additional unresolved decisions during architecture work.

Do NOT silently invent answers where the decision materially changes product behavior.

Document:

- question
- options
- recommendation
- reasoning
- impact

for every material unresolved issue.

---

## Current Goal

The immediate goal is NOT implementation.

The immediate goal is to transform this seed specification into a complete,
coherent engineering/design package for the initial Aura platform.

Do not implement application code during this phase.
