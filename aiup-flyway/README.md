<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-flyway

`aiup-flyway` is the AI Unified Process layer plugin for the **migration layer**: versioned
[Flyway](https://documentation.red-gate.com/flyway) SQL migrations derived from the entity model that
[`aiup-core`](../aiup-core/) produces. It is one plugin of a layer combination; it does not build data access, services,
or UI.

## Skills

| Layer     | Skill                                             | Test skill | Result                                                                     |
|-----------|---------------------------------------------------|------------|----------------------------------------------------------------------------|
| Migration | [`/flyway-schema`](skills/flyway-schema/SKILL.md) | –          | `V*.sql` scripts with sequences, tables, constraints, and foreign keys     |

The migration layer has no test skill: the persistence and service tests exercise the schema, and the test skills of
those layers write the test data migrations.

## How it is driven

`aiup-core` (3.0.0 or later) orchestrates the layer plugins:

```text
/architecture             → docs/architecture/development.md records flyway-schema for the Migration layer
/use-case-implement UC-001      → flyway-schema → persistence → service → API → UI
/use-case-test UC-001           → the test skills of the other layers
/use-case-coverage UC-001       → the audit, using the Markers table of docs/architecture/development.md
```

`/use-case-implement` runs `/flyway-schema` only when the use case needs a table, column, or constraint the schema does not
have yet. Run directly, `/flyway-schema UC-001` builds the migration layer of one use case, and `/flyway-schema`
without an argument creates the tables of every entity the schema does not have yet.

Migrations go to the location the Migration row of `docs/architecture/development.md` records — in a hexagonal reactor the
persistence adapter module. A business rule the database enforces gets a `-- UC-XXX BR-YYY:` comment above its
constraint, and the skill keeps its rows in the Markers table of `docs/architecture/development.md` current.

## Combinations

| Project                     | Plugins next to `aiup-core`                                                      |
|-----------------------------|----------------------------------------------------------------------------------|
| REST API, Spring Boot, jOOQ | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`                                   |
| REST API, Spring Boot, JPA  | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`                                    |
| Vaadin Flow, jOOQ           | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    |
| Hilla, jOOQ                 | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    |
| Angular, Spring Boot, JPA   | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`, `aiup-angular`, `aiup-playwright` |

Do not combine the layer plugins with a combined stack plugin (`aiup-vaadin-jooq`, `aiup-angular-jpa`,
`aiup-blazor-dotnet`, `aiup-nestjs-nextjs`); those ship their own migration skill — `/flyway-migration` in
`aiup-vaadin-jooq` and `aiup-angular-jpa`, `/ef-migration` in `aiup-blazor-dotnet`, `/drizzle-migration` in
`aiup-nestjs-nextjs`.

## Installation

### Tessl

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-flyway
```

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-flyway
```

See the marketplace [installation guides](../docs/installation/) for other agents and manual adoption.

## MCP servers

None. Flyway's documentation is reachable through `aiup-core`'s `context7` server.

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
