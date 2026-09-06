# Paper execution, monitoring, and Portfolio Ledger

## Paper boundary — SETTLED

Only Order Manager → Broker Interface → Paper Broker Adapter submits orders. The adapter contract permits future alternatives structurally; this implementation must contain no live-money implementation or live toggle. Active paper and research/shadow ledgers use different portfolio namespaces. Paper-vendor choice versus local simulator is OD-05, not a hidden integration claim.

## Recommended order lifecycle

| State | Allowed next states / meaning |
|---|---|
| CREATED | AUTHORIZED after atomic final risk/reservation; REJECTED if invalid |
| AUTHORIZED | SUBMITTING after gate check; EXPIRED/CANCELED if provably unsubmitted |
| SUBMITTING | ACKNOWLEDGED, PARTIALLY_FILLED, FILLED, REJECTED, or SUBMISSION_UNKNOWN |
| SUBMISSION_UNKNOWN | Reconcile by stable client ID into acknowledged/fill/reject/cancel state; no blind resubmit |
| ACKNOWLEDGED | PARTIALLY_FILLED, FILLED, CANCEL_PENDING, EXPIRED, REJECTED |
| PARTIALLY_FILLED | Further partial fills, FILLED, CANCEL_PENDING, CANCELED, EXPIRED |
| CANCEL_PENDING | CANCELED, PARTIALLY_FILLED, FILLED, or previous working state on rejected cancel |
| FILLED / CANCELED / EXPIRED / REJECTED | Terminal order status; late execution facts or explicit corrections still require reconciliation |

Status and cumulative fill facts are separate: a canceled order can retain prior partial fills. Never drop a valid late fill because a local state is terminal. Enforce monotonic unique execution totals, reconcile adapter corrections, and record status conflict rather than blindly moving state backward. Replacement, if supported, is a linked new order with fresh checks; it does not mutate the old authorization.

## Submit and recovery protocol

1. Persist immutable order intent, client order ID, authorized bounds, reservation, and policy references before any network call.
2. Acquire the submission gate, verify Full Kill, Entry Halt versus action, component health, current entry qualification, mode and authorization, and durably record dispatch admission. Dispatch outside the database transaction.
3. Adapter submission uses the same client ID for the logical order. Timeouts create SUBMISSION_UNKNOWN and retain reservation. Query client ID / execution history before retrying; if the adapter cannot establish identity, quarantine for reconciliation rather than risk duplicates.
4. Normalize acknowledgements/fills into durable receipts with provider IDs. Unique constraints plus consumer inbox deduplicate repeated receipts.
5. Ledger applies each fill once in an atomic posting transaction. Order projections advance from execution facts, and reservations shrink only for applied fills or proven canceled remainder.
6. On restart, reconcile every nonterminal/unknown order and adapter execution cursor before enabling new submissions. Detect externally changed paper state; do not invent balancing trades.

Adapter capabilities must explicitly report supported types, time-in-force, sessions, partial fills, cancel/replaces, client-ID lookup, correction semantics, and fees. Unsupported required behavior blocks qualification. A fill arriving before acknowledgement is valid if identity can be established. Orphan fills are quarantined, diagnosed, and reconciled before new allocation.

## Simulation realism

Adopted baseline local simulation policy: never fill using a decision's unavailable future bar or the same closing print that produced a close-based signal. Use the next eligible market observation plus configured latency. Buys consume ask-side assumptions; sells consume bid-side assumptions. Model spread, fees, slippage, volume participation, partial fills, halts, sessions, gaps, and missing data. A limit touch does not prove execution; queue position is unknown. When stop and target occur in one bar, flag path ambiguity and use an approved conservative rule or finer data. Do not claim second-level fidelity from daily bars.

Slippage is included in execution price, not deducted a second time from cash. Record the reference price and signed diagnostic slippage separately. Stress costs/latency/liquidity and compare provider-paper behavior with local assumptions. Paper fills do not establish achievable live returns. Capital is settled at 500.00 USD; LONG-only, no leverage/shorting and conditional fractional support are settled. Exact simulation, supported orders, quantity precision, costs and settlement remain OD-05/11.

## Position Monitor and exits

Cheap scheduled/event-driven code evaluates price, volume, volatility, market state, stop/target, time held, Pod rules, and thesis invalidation for each thesis lot. Coalesce noisy updates; do not lose higher-priority stop/time triggers. A material new event can request bounded AI reanalysis; AI absence does not stop approved deterministic monitoring.

Trigger → immutable ExitProposal referencing holdings/thesis version → Portfolio Manager close sizing → mode authorization → deterministic Risk Engine → Order Manager → fills → Ledger. Duplicate triggers share an exit-intent key, and pending exits reserve quantity so concurrent stops cannot oversell. A thesis revision is explicit and cannot automatically extend a losing horizon. Position closure occurs only after ledger quantity reaches zero and fills are booked; order submission is not closure. In Observe or Full Kill, record triggers and blocked exits visibly. Entry Halt retains monitoring and permits only healthy authorized reducing exits. Missing data/ledger/adapter integrity fails closed with a prominent blocked-risk reason.

## Canonical accounting model

SETTLED: one Portfolio Ledger tracks cash, holdings, quantities, cost basis, realized/unrealized P&L, fees, simulated slippage, value, fills, and exposure. Adopted baseline: immutable balanced journals plus quantity lots; PostgreSQL projections derive from these facts. Portfolio snapshots, dashboards, adapter balances, and analytical copies are not independent truth.

Initial capital is **500.00 USD** and LONG-only/no-leverage mechanics are settled. The adopted journal/lot architecture is capital-size independent; cost-basis, settlement and corporate-action policies remain OD-11. Use decimal monetary values/quantities with explicit currency and instrument precision, never binary floats for ledger math. Every journal has balanced debits/credits per currency, an economic effective time, recorded time, unique source, and correction linkage. Positions and cash update with the journal transaction and portfolio version. Rebuild projections from postings/lots and compare to stored views.

Illustrative fractional entries using settled initial capital (example prices, fees and immediate settlement are **test assumptions**, not vendor or accounting-policy selection):

| Economic event | Debit | Credit |
|---|---|---|
| Paper capital 500.00 USD, posted once per challenge | Cash 500.00 | Simulated contributed capital 500.00 |
| Buy 2.5 shares at 100.00, fee 0.50 | Security cost asset 250.00; fee expense 0.50 | Cash/payable 250.50 |
| Sell 0.75 shares at 110.00, fee 0.25; cost 75.00 | Cash/receivable 82.25; fee expense 0.25 | Security cost asset 75.00; realized gain 7.50 |

With immediate simulated settlement, remaining cash is 331.75, quantity 1.75, cost 175.00. At mark 110.00, market value is 192.50, unrealized gain 17.50, gross realized gain 7.50, fees 0.75, and equity 524.25 = capital 500.00 + net P&L 24.25. Slippage, if modeled, is embedded in fill price and not charged again. Fee/basis/settlement conventions remain OD-11. If settlement is modeled, receivables/payables settle through separate balanced entries; spendable cash is not automatically total cash.

Fractional quantities and unit costs retain exact supported precision; presentation rounding must not change holdings. Broker/instrument capability metadata defines quantity increments and minimums. Allocate fee/cost-basis rounding residuals deterministically to an explicit final lot/posting under the chosen policy; never silently discard fractional dust or write off an unexecutable remainder. Splits may create smaller holdings than normal order increments; preserve them and surface a blocked residual pending a supported liquidation/action rule (OD-11). Repeated receipts cannot repost initial capital or fills. A reset creates an explicitly authorized new challenge identity, never a hidden top-up to keep trading.

Invariant baseline: equity = cash + marked holdings + receivables − payables (plus explicitly modeled assets/liabilities); equity change adjusted for external capital flows equals total net P&L. Realized and unrealized components must sum consistently with fee treatment. Marks carry source/time/quality; stale marks make valuation stale, not zero. Reservations affect available capacity, not economic cash or P&L.

Corporate actions require effective-dated split/merger/dividend/delisting treatment and reconciliation, or exclusion rules that prevent unsupported holdings from reaching an event. Splits alter quantity/unit basis while preserving aggregate basis; dividends require entitlement and payment accounting; delistings cannot be dropped from history. Bust/correct reverses original journal/lot effects and posts replacement facts with lineage. No deletion or ad hoc cash overwrite. Corporate actions and corrections are release blockers for the enabled universe (OD-11).
