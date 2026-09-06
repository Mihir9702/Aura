# Product, principles, and terminology

## Product vision — SETTLED

Aura seeks expected long-term capital growth from statistically supported opportunities while controlling catastrophic loss. This is an objective to evaluate, not a performance promise. The initial executable environment is paper trading only, covering US-listed equities and ETFs. Liquidity, capitalization, spreads, and data reliability shape eligibility; thresholds remain OD-02. Multi-horizon support is architectural: seconds/minutes through days/weeks, potentially longer later. Multiple Pods/horizons may operate simultaneously. All five named Pods—Momentum, Breakout, Event / Catalyst, Mean Reversion, Swing Trend—must be structurally supported by the initial comprehensive system. Each version/horizon must qualify independently before activation; code existence is not qualification. Seconds-level/HFT capability requires data and latency evidence (OD-03).

Initial paper challenge capital is **500.00 USD**. Architecture remains capital-size independent. Initial trading is **LONG only, no leverage, no short selling**, with fractional shares supported only when both instrument and paper adapter capabilities permit them. Unsupported mechanics fail closed. Options data may be evidence; options trading is disabled.

Success requires reproducible decisions, correct accounting, reliable recovery, defensible out-of-sample evidence, and a user who can return after unattended operation and understand what happened. Doing nothing is a valid outcome. Trade volume is not a success metric. Shadow evaluation measures foregone opportunities without pretending every rejected trade was simultaneously affordable.

## Principles — SETTLED

1. Separate deterministic computation from model reasoning and execution authority.
2. Search broadly and cheaply; deepen analysis selectively. Every data source and AI role must earn its cost through evaluation.
3. Preserve evidence, counterevidence, uncertainty, and what was known at decision time.
4. Keep the original strategy, horizon, thesis, and invalidation conditions. A losing short-term position cannot silently become a long-term investment.
5. Use one accounting truth, constrained risk profiles, and non-removable Global Guardrails.
6. Learn through hypotheses, backtests, out-of-sample validation, and paper experiments. No autonomous rewriting or promotion of production logic.
7. Prefer explicit modular boundaries and real vertical slices over extra services or placeholder completeness.

## Modes

| Mode — SETTLED | User experience | Adopted execution path; remaining permissions in OD-06 |
|---|---|---|
| Observe | Analyze; execute nothing | Persist hypothetical proposals and risk previews; no order authorization or active-paper reservations |
| Assisted Paper | Propose; user approves/rejects | Approval binds an immutable proposal revision and expires; final portfolio/risk checks occur afterward |
| Autonomous Paper | Complete paper workflow automatically | Same proposal, portfolio, risk, and audit path; explicit mode policy substitutes for manual approval |

Balanced is the default risk profile. **Observe is the settled default mode.** Remaining exit preauthorization and mode-change details are OD-06; mode transitions invalidate pending authorizations; Observe prevents all new submissions, including exits. Existing orders/positions require visible handling, not disappearance. Full Kill and component Health Gates take precedence over mode permissions. Entry Halt blocks entries/increases while permitting only authorized, healthy reducing exits; it never grants a permission absent in Observe. User approval never overrides risk. Exit approval policy remains OD-06; deterministic exits need no AI, but still need the approved mode authorization policy.

## Glossary

| Term | Meaning |
|---|---|
| Instrument | Stable security identity; a ticker is a time-varying alias |
| Knowledge time | Earliest recorded time Aura could use a particular data revision |
| Event time | When the underlying market event occurred |
| Feature snapshot | Immutable deterministic features with input manifest and as-of cutoff |
| Scanner | Broad low-cost eligibility/signal filter |
| Strategy Pod | Versioned methodology generating opportunities and monitoring conditions |
| Candidate | Scoped opportunity awaiting triage/analysis, not an order |
| Analysis | One AI role's validated evidence assessment |
| Committee | Scoped collection of analyses plus evidence-based adjudication |
| Trade Proposal | Immutable investment thesis and entry/exit intent, without execution authority |
| Allocation intent | Portfolio Manager's requested quantity/budget against a portfolio version |
| Risk Decision | Deterministic APPROVE, RESIZE, or REJECT for a bound intent |
| Authorization | Short-lived execution permission bound to all necessary checks; not an AI output |
| Order | Paper execution instruction tracked by Order Manager |
| Fill | A unique paper execution fact; may fill only part of an order |
| Position | Ledger-derived aggregate holdings plus attribution lots |
| Thesis lot | Fill allocation retaining originating strategy, horizon, and exit rules |
| Shadow Portfolio | Isolated counterfactual ledger under an explicit decision policy |
| Research League | Comparable, uncertainty-aware evaluation of strategies and AI roles |
| Global Guardrails | Hard integrity/safety constraints every risk profile obeys |
| Health gate | Technical readiness restrictions, separate from investment risk budgets |
| Entry Halt | Blocks new/increasing exposure; healthy authorized reducing exits may continue |
| Full Kill | Blocks every new submission, best-effort cancels working orders, preserves receipts/Ledger/reconciliation; human re-arm |
| Regime snapshot | Deterministic versioned market-wide state with causal inputs, not an LLM description |
| Qualification | Owner-approved eligibility for a specific Pod version/horizon/scope; separate from implementation status |

Not included initially: real-money execution, self-modifying strategies, inferred regulatory/compliance readiness, claims of realistic high-frequency execution, or every eventual data source. Shorting, leverage and options trading are disabled initially. Order types, hours, corporate-action and settlement details remain in the register.
