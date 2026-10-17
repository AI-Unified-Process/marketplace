<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-jpa

`aiup-jpa` is the **Persistence** layer plugin of the [AI Unified Process](https://unifiedprocess.ai) for Spring
Data JPA and Hibernate. It maps the tables of the Flyway schema onto JPA entities, writes the Spring Data
repositories, queries, and projections a use case needs, and tests the queries that have logic of their own against
a real database in a Testcontainers container.

It is one plugin per layer: combine it with `aiup-core` and the plugins of the other layers instead of a combined
stack plugin such as `aiup-angular-jpa`.

## Requirements

- `aiup-core` **3.0.0 or later**. Its `/architecture` records this plugin as the Persistence layer in
  `docs/architecture/development.md`; `/use-case-implement` and `/use-case-test` run the skills below in their place in the layer order, and
  `/use-case-coverage` finds their code and tests by the markers they keep in that document.
- A Migration layer that owns the schema — normally `aiup-flyway` with `/flyway-schema`. Hibernate only validates
  the schema (`ddl-auto=validate`); it never creates it.

## Skills

| Skill                   | Layer       | Result                                                                                              |
|-------------------------|-------------|-----------------------------------------------------------------------------------------------------|
| `/jpa-persistence`      | Persistence | `@Entity` classes, Spring Data repositories, queries, projections, converters; in a hexagonal backend the outbound port and its adapter |
| `/jpa-persistence-test` | Persistence | `UC<id><Name>RepositoryTest` with `@DataJpaTest`, Testcontainers, and Flyway test data             |

Both skills are normally run by `/use-case-implement UC-XXX` and `/use-case-test UC-XXX`; each can also be run directly for one
use case. Neither runs the coverage audit — that is `/use-case-coverage UC-XXX`.

### Flat and hexagonal backends

`/jpa-persistence` detects the module layout. In a flat single module, the service layer calls the Spring Data
repository directly. In a hexagonal multi-module backend (`*-domain`, `*-business`, `*-postgres`, …), it writes the
`@Entity`, the Spring Data repository, the converters, and the adapter in the persistence-adapter module — and,
because persistence runs before the service layer, the domain record and the outbound port interface the adapter
implements when they do not exist yet. The service layer then builds on that port. No inbound port is ever invented,
and no Lombok is used.

## Combinations

| Project                       | Plugins next to `aiup-core`                                                      |
|-------------------------------|----------------------------------------------------------------------------------|
| REST API, Spring Boot, JPA    | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`                                    |
| Angular, Spring Boot, JPA     | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`, `aiup-angular`, `aiup-playwright` |

Do not combine the layer plugins with a combined stack plugin (`aiup-angular-jpa`); it ships its own `/implement`.

## Installation

### Tessl

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-flyway
tessl install ai-unified-process/aiup-jpa
tessl install ai-unified-process/aiup-spring-boot
```

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-flyway
/plugin install aiup-jpa
/plugin install aiup-spring-boot
```

See the marketplace [installation guides](../docs/installation/) for other agents and manual adoption.

## MCP servers

The plugin configures the optional JavaDocs server (`https://www.javadocs.dev/mcp`) for Spring Data JPA, Hibernate,
and Testcontainers API lookups. See [rules/mcp-servers.md](rules/mcp-servers.md).

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
