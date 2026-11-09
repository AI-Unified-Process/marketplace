<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-drizzle

`aiup-drizzle` is the AI Unified Process layer plugin for the **migration and persistence layers** of a TypeScript
project: a [Drizzle](https://orm.drizzle.team/docs/overview) schema over PostgreSQL with generated migrations, derived
from the entity model that [`aiup-core`](../aiup-core/) produces, and the repositories of a NestJS API. It is one plugin
of a layer combination; it does not build services, an API, or a UI. Its skills derive from the deprecated combined
plugin [`aiup-nestjs-nextjs`](../aiup-nestjs-nextjs/), which a contributor wrote.

## Skills

| Layer       | Skill                                                         | Test skill                                                              | Result                                               |
|-------------|---------------------------------------------------------------|-------------------------------------------------------------------------|------------------------------------------------------|
| Migration   | [`/drizzle-schema`](skills/drizzle-schema/SKILL.md)           | –                                                                       | `pgTable` definitions and generated SQL migrations   |
| Persistence | [`/drizzle-persistence`](skills/drizzle-persistence/SKILL.md) | [`/drizzle-persistence-test`](skills/drizzle-persistence-test/SKILL.md) | Repositories, and their tests on Testcontainers PostgreSQL |

The migration layer has no test skill: the tests of the layers above exercise the schema.

## How it is driven

`aiup-core` (3.14.0 or later) orchestrates the layer plugins:

```text
/stack                     → docs/architecture/stack.md records the Drizzle skills
/use-case-implement UC-001 → drizzle-schema → drizzle-persistence → service → API → UI
/use-case-test UC-001      → the integration layer's tests, and the layers above it
/use-case-coverage UC-001  → the audit, using the Markers table of docs/architecture/stack.md
```

Two rules set these skills apart from the Java persistence plugins:

- **Migrations are generated, never hand-written.** `/drizzle-schema` edits the schema file and runs
  `drizzle-kit generate`; a hand-written migration breaks the journal the next diff is computed from. A business rule
  marker therefore sits in the schema file, not in the SQL.
- **The repository owns the transaction.** Drizzle has no ambient transaction and a service runs no query, so an atomic
  write is one repository method, and a write across repositories passes an optional `tx` parameter.

`/drizzle-persistence-test` runs only for queries the integration layer cannot reach, to reconcile existing tests, or
when the persistence layer is named. The test setup it uses lives in `aiup-nestjs`.

## Combinations

| Project                       | Plugins next to `aiup-core`                                        |
|-------------------------------|--------------------------------------------------------------------|
| REST API, NestJS, Drizzle     | `aiup-drizzle`, `aiup-nestjs`                                      |
| Next.js, NestJS, Drizzle      | `aiup-drizzle`, `aiup-nestjs`, `aiup-nextjs`, `aiup-playwright`    |

`aiup-drizzle` builds on the service layer of `aiup-nestjs` and declares it as a plugin dependency, so Claude Code
installs it too. Do not combine the layer plugins with a combined stack plugin.

## Installation

### Tessl

Tessl does not install dependencies, so name all of them:

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-nestjs
tessl install ai-unified-process/aiup-drizzle
```

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-drizzle
```

See the marketplace [installation guides](../docs/installation/) for other agents and manual adoption.

## MCP servers

| Server     | Purpose                                                  |
|------------|----------------------------------------------------------|
| `context7` | Current Drizzle, Vitest, and Testcontainers documentation on demand |

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
