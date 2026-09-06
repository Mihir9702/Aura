# User experience, UI architecture, and reporting

## Experience goals — SETTLED

Aura should work unattended when requested and explain itself when the user returns. The interface is a professional React/TypeScript/Vite web app using Tailwind CSS and shadcn/ui where useful. Linear, Stripe, Notion, and later supplied ADIYA OS references are inspirations, not templates to clone. Aura needs its own coherent language. No ADIYA OS screenshots have been supplied or analyzed in this package.

## Navigation — Adopted baseline

| Area | Views and questions answered |
|---|---|
| Overview | Dashboard, equity/cash/exposure, decisions since last visit, current mode/profile, health |
| Trading | Portfolio, Positions, Trade History, orders/fills, thesis lots, exit triggers |
| Discovery | Market Scanner, Opportunities, Strategy Pods, filters and rejection funnel |
| Decision detail | Trade Proposal, Committee evidence/disagreement, Portfolio Manager allocation, Risk Decision, approval/history |
| Research | Shadow Portfolios, Research League, Backtesting, Experiments, comparison limitations |
| Knowledge | Document/source rights, references, experiment findings, retrieval citations |
| Reports | Daily, weekly, monthly performance and decision narratives |
| Operations | System health, logs/audit, incidents, model usage, settings, Entry Halt / Full Kill / re-arm controls |

Persistent shell displays PAPER environment, mode, risk profile, as-of/freshness, and separate Entry Halt / Full Kill status. Never label paper value as real broker money. Use semantic design tokens, accessible contrast, keyboard focus, readable density, consistent status vocabulary, timezone labels, and text/icons in addition to red/green. Detailed visual design and ADIYA references remain OD-16.

## Core flows

Observe: inspect scanner → candidate → evidence → hypothetical proposal/risk preview, with execution disabled. Assisted Paper: inspect immutable proposal, downside/uncertainty, entry bounds, intended horizon/invalidation/exit, allocation and risk preview → approve/reject → final checks → order timeline. Approval response can be expired, superseded, resized within an approved envelope, or newly rejected; it cannot imply a fill. Autonomous Paper: user enables policy after prerequisites, then reviews the same complete timeline and exceptions.

Position detail shows quantity/cost basis, realized and unrealized P&L, fees, current mark freshness, originating thesis/horizon per lot, stops/targets, pending exits, and invalidation events. A blocked exit or unknown order is prominent. Separate Entry Halt and Full Kill controls show their exact effects. Entry Halt permits only healthy authorized reducing exits; Full Kill blocks all new submissions, attempts cancellation and requires human re-arm. Show activation result, in-flight orders, blocked exit risk and cancellation/reconciliation progress. Never imply Full Kill liquidates holdings.

Research comparisons expose capital, dates, costs, samples, regime, uncertainty, inclusion rules, and whether results are prospective or contaminated/limited. Inference views show structured rationale/citations rather than hidden chain-of-thought. Non-implemented integrations have explicit unavailable status; do not fabricate market activity or completed analysis.

## Frontend boundaries

Use feature-oriented routes and typed API clients generated later from approved server contracts. Server owns accounting, risk, mode state, and authorization; browser only formats and requests actions. Separate query/read state from command state; use expected versions/idempotency keys for mutations. Disable optimistic success for approvals, mode/capability-control changes, and orders until acknowledged. Reconnect refreshes snapshots and watermarks; missed streaming messages cannot become lost truth. SSE is the settled initial update direction; reconnect always refreshes authoritative snapshots.

Every view defines loading, empty, stale, partial, denied, failed, and unavailable states. Timestamps include as-of and last refresh; decimal amounts are formatted without losing server precision. Large histories paginate/filter server-side. Screens adapt to smaller widths with detail drawers/tables; accessibility and critical controls take priority over decorative motion.

## Reports

Daily/weekly/monthly reports pin period/calendar, portfolio snapshot/valuation watermark, data completeness, fee/cost conventions, benchmark if approved, and generation version. Explain performance, decisions, opportunities, executed/rejected trades, Pod performance, AI disagreement, risk intervention, cash opportunity cost, and important observations. Numbers come from deterministic queries; optional model narrative cites those outputs and cannot invent metrics.

Late fills/corrections create a revised report with visible supersession, preserving the original. Incomplete close/reconciliation produces a provisional report, not falsely final P&L. Report scheduling/timezone/benchmark conventions are OD-03/15. Notifications and delivery channels are OD-16; local reporting does not authorize email or messaging integrations.
