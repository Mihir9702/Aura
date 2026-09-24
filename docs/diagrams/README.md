# Editable Mermaid diagrams

Raw `.mmd` files can be edited and rendered in a Mermaid-compatible viewer. These visualize the adopted owner-amended baseline; settled boundaries and open policy parameters are defined in the [Design Bible](../design-bible/README.md). Sources have been structurally checked but not rendered in this run. Read the lifecycle tables for transitions omitted from overview diagrams.

- [System context](01-system-context.mmd)
- [Full Aura architecture](02-full-architecture.mmd)
- [Market data pipeline](03-market-data-pipeline.mmd)
- [Candidate discovery](04-candidate-discovery.mmd)
- [Strategy Pods](05-strategy-pods.mmd)
- [AI Investment Committee](06-investment-committee.mmd)
- [Trade lifecycle](07-trade-lifecycle.mmd)
- [Risk decision lifecycle](08-risk-decision.mmd)
- [Paper order lifecycle](09-paper-order-lifecycle.mmd)
- [Position monitoring](10-position-monitoring.mmd)
- [Exit lifecycle](11-exit-lifecycle.mmd)
- [Shadow Portfolio flow](12-shadow-portfolios.mmd)
- [Research and learning loop](13-research-learning.mmd)
- [Event architecture](14-event-architecture.mmd)
- [Data architecture](15-data-architecture.mmd)
- [Deployment architecture](16-deployment.mmd)

Full architecture arrows show logical flow, not one service per box. Paper-order diagrams summarize the main transitions; late fills, cancel rejections, expiry and corrections follow the [execution specification](../design-bible/06-execution-and-accounting.md). Single-owner deployment/SSE direction and Committee role names are approved; vendors and required-role policies remain open. See [capability-control semantics](../design-bible/10-safety-and-operations.md) for dispatch admission and in-flight fills.

- [Market Regime pipeline](17-regime-pipeline.mmd)
- [Entry Halt / Full Kill / Health Gates](18-capability-controls.mmd)
- [Strategy lifecycle and qualification](19-strategy-lifecycle.mmd)

- [Implemented local foundation](20-implemented-foundation.mmd)
