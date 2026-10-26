<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-jooq

`aiup-jooq` is the AI Unified Process layer plugin for the **persistence layer** with [jOOQ](https://www.jooq.org):
type-safe repositories over the classes jOOQ generates from the Flyway migrations, and their tests against a real
database. It is one plugin of a layer combination; it builds neither the schema nor services or UI.

## Skills

| Layer       | Skill                                                   | Test skill                                                          |
|-------------|---------------------------------------------------------|---------------------------------------------------------------------|
| Persistence | [`/jooq-persistence`](skills/jooq-persistence/SKILL.md) | [`/jooq-persistence-test`](skills/jooq-persistence-test/SKILL.md)   |

- **`/jooq-persistence UC-001`** — one `@Repository` per aggregate with an injected `DSLContext`; projections into
  Java records with `Records.mapping`, `MULTISET` for nested collections, paging and dynamic filters, optimistic
  locking for versioned entities, and jOOQ code generation from the migrations when the project has none. Business
  rules enforced by a query condition carry `// UC-XXX BR-YYY:`. Transactions stay with the service layer. Its
  Handover lists the repository methods and record types the service layer builds on.
- **`/jooq-persistence-test UC-001`** — `UC<id><Name>RepositoryTest` classes with `@UseCase` on every method,
  against Testcontainers or the project's database, test data from Flyway test migrations. Only queries with logic
  of their own are tested; what the integration layer's tests already exercise is not repeated, and `/use-case-test` runs
  it only when the persistence layer is named, has tests to reconcile, or holds a query the integration layer
  cannot reach.

## How it is driven

`aiup-core` (3.3.0 or later) orchestrates the layer plugins:

```text
/stack             → docs/architecture/stack.md records jooq-persistence and jooq-persistence-test
/use-case-implement UC-001      → migration → jooq-persistence → service → API → UI
/use-case-test UC-001           → the integration layer's test skill (UI, API, or service), then the layers above it
/use-case-coverage UC-001       → the audit, using the Markers table of docs/architecture/stack.md
```

A use case is tested once, in the integration layer recorded in `docs/architecture/stack.md` — the Vaadin Flow
view tests, the REST API tests, or the service tests behind Hilla. `/jooq-persistence-test` runs below it only to
reconcile existing tests, for a query the integration layer's skill reports it cannot reach, or when the
persistence layer is named; it tests business rules only when persistence is the integration layer, or when run
directly with no layer above it.

Both skills can be run directly; they then read the same inputs and follow the same rules as `/use-case-implement` and
`/use-case-test`, and end with a `Next:` line to the next layer. Each skill keeps its rows in the Markers table of
`docs/architecture/stack.md` current.

## Combinations

| Project                     | Plugins next to `aiup-core`                                   |
|-----------------------------|---------------------------------------------------------------|
| REST API, Spring Boot, jOOQ | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`                |
| Vaadin Flow, jOOQ           | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin` |
| Hilla, jOOQ                 | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin` |

Do not combine the layer plugins with a combined stack plugin such as `aiup-vaadin-jooq`, which ships its own
`/implement`.

## Installation

### Tessl

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-flyway
tessl install ai-unified-process/aiup-jooq
tessl install ai-unified-process/aiup-spring-boot
```

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-flyway
/plugin install aiup-jooq
/plugin install aiup-spring-boot
```

See the marketplace [installation guides](../docs/installation/) for other agents and manual adoption.

## Prerequisites

- `aiup-core` 3.3.0 or later, `docs/entity_model.md`, `docs/use_cases/UC-*.md`, and `docs/architecture/stack.md`.
- A Maven or Gradle Spring Boot project with `spring-boot-starter-jooq` and Flyway migrations.
- Docker for Testcontainers (code generation and repository tests) unless the project uses another database setup.

## MCP servers

| Server     | Purpose                                                        |
|------------|----------------------------------------------------------------|
| `jOOQ`     | Query DSL reference and code generation guide                  |
| `JavaDocs` | jOOQ, Spring Boot, Testcontainers, and other classpath APIs    |

See [`rules/mcp-servers.md`](rules/mcp-servers.md) for setup details.

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
