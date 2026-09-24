# Aura Design Bible

This package translates [Aura_Seed.md](../../Aura_Seed.md) into an implementation handoff. It is the architectural specification. A first runnable foundation now exists; see [implementation status](../IMPLEMENTATION_STATUS.md) for the precise subset and test evidence.

## Authority and status

Precedence: explicit subsequent product-owner decisions → seed → accepted ADRs consistent with the seed → detailed design. A conflict must be resolved explicitly, never by choosing the most convenient document. This run explicitly settles the initial stack and modular-monolith approach requested in the architecture brief; it does not approve numeric trading policies or vendors.

**SETTLED** means stated by the seed/current brief or explicitly approved later. **RECOMMENDED** means a concrete design proposal awaiting adoption. **OPEN** means an owner decision remains. **EXPERIMENTAL** means research-only, not permitted to influence production allocation without promotion approval. The owner has approved OD-01 **with amendments** in the [owner refinement record](18-owner-decisions.md). The detailed engineering baseline, conceptual contracts and tooling direction are now adopted. Explicitly unresolved policy parameters remain OPEN; new recommendations are labeled as such. Normative requirements describe the adopted design without inventing numeric policy or vendor choices. Conceptual contracts are still non-executable and require implementation validation.

OD-01 is closed as APPROVED WITH AMENDMENTS; do not ask for its approval again. Implementation was authorized on 2026-09-10; changes require synchronized contracts/ADRs. Open product policy can remain open for unrelated slices, but cannot be supplied with invented defaults.

## Reading map

| Document | Scope |
|---|---|
| [01 Product and principles](01-product-and-principles.md) | Vision, scope, glossary, user modes |
| [02 System architecture](02-system-architecture.md) | Context, ownership, dependencies, authority |
| [03 Market and discovery](03-market-and-discovery.md) | Data, features, scanner, Pods, candidates |
| [04 AI and knowledge](04-ai-and-knowledge.md) | Committee, Model Router, Knowledge Library |
| [05 Portfolio and risk](05-portfolio-and-risk.md) | Allocation, guardrails, approvals, risk decisions |
| [06 Execution and accounting](06-execution-and-accounting.md) | Orders, exits, fills, ledger, monitoring |
| [07 Research and learning](07-research-and-learning.md) | Shadows, League, experiments, backtesting |
| [08 Events and orchestration](08-events-and-orchestration.md) | Delivery, concurrency, jobs, scheduling |
| [09 Storage](09-storage.md) | PostgreSQL, Parquet, DuckDB, retention, replay |
| [10 Safety and operations](10-safety-and-operations.md) | Health Gates, Entry Halt / Full Kill, security, deployment, cost |
| [11 User experience](11-user-experience.md) | Navigation, workflows, reports, UI architecture |
| [12 Contracts](12-contracts.md) | Conceptual types, validation, interfaces |
| [13 Implementation plan](13-implementation-plan.md) | Monorepo, tooling, milestones, gates |
| [14 Verification](14-verification.md) | Tests, AI evaluation, acceptance matrix |
| [15 Open Decisions](15-open-decisions.md) | Questions, alternatives, recommendations, approvals |
| [16 Architecture review](16-architecture-review.md) | Adversarial review, revisions, residual risks |
| [17 Strategies and market regime](17-strategies-and-regime.md) | First-class Pods, qualification, deterministic regime |
| [18 Owner decisions](18-owner-decisions.md) | Authoritative refinement record and ADR mapping |

[ADRs](../adr/README.md) explain settled choices. [Diagrams](../diagrams/README.md) visualize these contracts. [Architecture status](../ARCHITECTURE_STATUS.md) is the implementation-readiness entry point. Diagrams omit fields for legibility; detailed lifecycle and contract documents govern semantics.
