# Portfolio Manager and deterministic Risk Engine

## Portfolio Manager

SETTLED responsibility: evaluate whether an individually attractive opportunity fits current cash, exposure, diversification, correlation, concentration, strategy allocation, and competing opportunities. It is not a second accounting system.

Adopted baseline: read a versioned Ledger snapshot plus outstanding reservations and orders. Produce an AllocationIntent or a documented decline/defer. Intent references proposal revision, requested decimal quantity, supported instrument/adapter quantity increment, estimated costs, portfolio version, quote/feature snapshots, allocation-policy version, priority, and expiry. Rank competing opportunities using a versioned deterministic policy with explicit tie-breaking; do not pretend incomparable model confidence scores are comparable expected values. Allocation methodology is OD-07. Initial recommendation is transparent bounded allocation, not a complex optimizer without validated estimates.

Same-instrument proposals share portfolio exposure even across horizons/Pods. Maintain strategy/thesis attribution lots while sizing against the net portfolio and outstanding commitments. Initial LONG-only scope forbids shorts and leverage. Sells are reducing/closing existing long lots, never opposite-direction entries. Lot selection and cross-Pod close attribution remain OD-07/11. Do not silently cancel another Pod's thesis. Unknown correlations are an uncertainty flag subject to approved conservative policy, not assumed diversification.

## Proposal and permission lifecycle

Adopted baseline proposal workflow states: VALIDATED → ALLOCATION_PENDING → PERMISSION_PENDING → RISK_PENDING → ORDER_LINKED. Observe ends at RECORDED_ONLY after an explicitly hypothetical allocation/risk preview. Portfolio decline, user rejection, final risk rejection, expiry, and supersession end the current workflow as DECLINED, USER_REJECTED, RISK_REJECTED, EXPIRED, or SUPERSEDED, with distinct reasons. Technical failures retain a failed attempt and may retry only while the same revision remains valid. Autonomous mode still traverses PERMISSION_PENDING, resolved by its approved mode policy rather than a human click.

ORDER_LINKED means an order exists, not that it filled; execution status belongs to Order Manager. ExecutionAuthorization separately moves VALID → ADMITTED or INVALIDATED/EXPIRED before dispatch. Once ADMITTED, the durable order/attempt governs recovery even after authorization expiry. One proposal revision has at most one logical entry order under the initial baseline; a new entry attempt after a terminal order requires a newly evaluated proposal revision and permission. This avoids a rejected or canceled order silently spending an old approval again.

## Risk Engine

SETTLED: deterministic, authoritative APPROVE / RESIZE / REJECT; may reduce requested risk, never rewrite thesis or substitute instruments. Global Guardrails bind Conservative, Balanced (default), and Aggressive. Profiles change budgets; regime-dependent adjustment is EXPERIMENTAL pending evaluation and OD-07.

Adopted baseline function:

`evaluate(proposal, allocation, portfolio, reservations, market_quality, health, policy, now) -> RiskDecision`

All inputs and policy versions are immutable references. Each rule yields code, observed value, bound, disposition, and evidence. Stable evaluation order and decimal rounding make replay deterministic. APPROVE grants requested admissible size; RESIZE grants a strictly smaller positive admissible size; zero size is REJECT. Exit quantity is bounded by available holdings and reserved exits; a close cannot accidentally open a short. Fractionals are supported only where instrument and adapter allow them; exact minimum lot/notional, increments and order capabilities remain OD-05. Never round a cap upward.

## Guardrails and profile policy

| Class | Required principle | Numeric/behavioral policy |
|---|---|---|
| Execution integrity | Paper-only adapter, valid instrument/contract, unique intent, authorized mode | No profile override |
| System integrity | Known ledger, usable required data, healthy submission path, valid clock, action-specific Health Gates and capability controls permit | Thresholds OD-04/12 |
| Capacity | Account for filled exposure and all pending commitments; prevent overspending/overselling | No leverage/shorting; settlement/spendable cash OD-11 |
| Investment budgets | Position/sector/strategy/gross/net exposure, loss/drawdown and liquidity constraints | Limits and response OD-07 |
| Thesis integrity | Valid horizon, entry/invalidation/exit rules, unexpired evidence and approval | Expiry/allowed order semantics OD-03/05/06 |

No numeric risk budgets are approved by this package. Configuration must remain non-executable for active paper trading until an owner-approved version supplies all required fields. An Aggressive profile cannot remove a guardrail. Technical integrity controls and investment budgets are separately reported.

## Authorize and reserve

Under a per-portfolio gate lock, refresh Ledger and reservation state, evaluate final risk, and atomically store RiskDecision + reservation + order intent + outbox. A prior UI risk preview does not reserve funds. A stale version returns re-evaluation required, not silent approval. Reservations include worst-case admissible cash/fees/slippage for buys or available quantity for closes. A changed price outside the approved bound requires reevaluation; market-order admissibility needs a bounded execution policy (OD-05).

Pending submissions retain reservations, including ambiguous network outcomes. Partial fills convert the corresponding reservation into booked exposure; unfilled remainder stays reserved. Definitive cancel/reject/expiry releases only confirmed unfilled capacity. Authorization expiry before dispatch can release an unsubmitted intent after verifying it was never attempted. Authorization expiry after an attempted submit does **not** establish absence at the adapter.

Approval binds proposal revision and a bounded size/price/horizon envelope. Recommended Assisted Paper behavior: safe downward resizing within the displayed envelope may proceed; upward changes, changed thesis, or changed entry logic require new approval. Exact envelope and expiry are OD-06. Mode/policy changes invalidate pending unsubmitted authorization and trigger final checks. The submit gate rechecks Entry Halt/Full Kill, action-specific health, mode/policy, and current Pod version/horizon qualification/activation immediately before entry dispatch; see the precise concurrency limit in [operations](10-safety-and-operations.md).

## Exits and reducing risk

Investment concentration limits should not mechanically prohibit a reducing exit because the existing portfolio already breaches them. Rules distinguish opening risk from reducing risk. Nevertheless, every exit requires valid holdings, required market data, adapter state, mode/exit authorization, Full Kill clear, and ledger integrity. Entry Halt permits only proven reducing exits meeting those requirements; it is not a bypass. Qualification expiry/suspension blocks new strategy exposure but does not abandon its held lots or safe authorized exits. An exit can be partial, stop-driven, target-driven, time-driven, thesis-invalidated, or policy-driven. Stale-data emergency exit behavior and automatic loss-limit responses need OD-06/07/12; absent approval, halt unsafe submissions and surface required action. Neither models nor users bypass Global Guardrails.

## Small-capital and qualification invariants

Initial shared capital is 500.00 USD. Sizing uses available cash after all Pods' fees and pending commitments, not nominal per-Pod capital. Quantity is rounded down to an instrument-and-adapter-supported increment using decimal arithmetic; if no admissible positive quantity remains, REJECT. Do not round up to a whole share, borrow funds, assume fractional support, or raise risk to offset small capital. Revalidate current fractional/minimum-notional capabilities at dispatch. Capabilities used to qualify a Pod/horizon must cover its actual orders; current strategy eligibility generation joins the authorization inputs. League scores and regime labels cannot set raw size or limits without a qualified, owner-approved policy.
