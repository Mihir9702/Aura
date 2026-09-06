# ADR 0004: Parquet and DuckDB analytical datasets

Status: **Accepted — SETTLED**. Date: 2026-09-05.

## Context

Large historical datasets and research queries have different access patterns from operational state.

## Decision

Store historical analytical datasets in Parquet and query pinned datasets with DuckDB. Keep operational mutations in PostgreSQL.

## Alternatives considered

Putting all history into operational tables couples research scans to execution workload. A distributed warehouse adds cost and services before demonstrated need.

## Consequences

Immutable manifests enable repeatable analysis and portable storage. File publication and database registration need explicit recovery; analytical copies must carry watermarks.

## Unresolved details

OD-01/04/13: manifest details, dataset rights/volume and local versus object storage. See the [register](../design-bible/15-open-decisions.md). Acceptance of this ADR does not approve those details.

Authority: [seed](../../Aura_Seed.md) and current architecture brief. See [Design Bible](../design-bible/README.md) for contracts and workflow implications.
