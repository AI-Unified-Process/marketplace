<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-nestjs-nextjs

`aiup-nestjs-nextjs` is the AI Unified Process construction plugin for a NestJS API using Drizzle ORM over PostgreSQL and a Next.js
App Router frontend. It turns the artifacts produced by [`aiup-core`](../aiup-core/) into schema migrations, a REST
API, a web UI, and tests across both applications.

This plugin is designed to continue from the specifications produced by `aiup-core`. For the complete AI Unified Process workflow,
use it alongside `aiup-core` and select one stack plugin.

## Architecture support

The plugin supports a split client/server architecture whose applications share a JSON contract. It detects app
roots, workspace structure, routing conventions, existing fetch clients, and package settings before writing code.

Two TypeScript-specific concerns are handled explicitly:

- NestJS projects using ESM and NodeNext require `.js` suffixes on relative imports even when the source files are
  TypeScript; projects using other module settings must not receive those suffixes.
- NestJS dependency injection requires decorator metadata. Vitest configurations need an appropriate transformer,
  including `unplugin-swc` and the applicable Vite/Oxc setting, to preserve that metadata.

The shared layout detection is documented in
[`skills/implement/references/project-layout.md`](skills/implement/references/project-layout.md).

## Skills and workflow

| Phase        | Skill                                                     | Result                                                             |
|--------------|-----------------------------------------------------------|--------------------------------------------------------------------|
| Construction | [`/drizzle-migration`](skills/drizzle-migration/SKILL.md) | Drizzle schema changes and generated PostgreSQL migrations         |
| Construction | [`/implement`](skills/implement/SKILL.md)                 | NestJS feature module and Next.js page                             |
| Construction | [`/nest-test`](skills/nest-test/SKILL.md)                 | Vitest unit tests and Supertest tests on Testcontainers PostgreSQL |
| Construction | [`/react-test`](skills/react-test/SKILL.md)               | React Testing Library component tests                              |
| Construction | [`/playwright-test`](skills/playwright-test/SKILL.md)     | Browser journeys derived from `UC-*` or `TC-*` artifacts           |

```text
Construction
──────────────────────────────────────────────────────
/drizzle-migration  →  /implement  →  /nest-test
                                   ↘  /react-test
                                   ↘  /playwright-test
```

The linked `SKILL.md` files are the authoritative reference for detailed inputs, outputs, and behavior.

## Installation

### Tessl

Initialize the project once:

```sh
tessl init --agent agents
```

`agents` is the vendor-neutral layout; use `claude-code`, `cursor`, `gemini`, `codex`, `copilot`, or `copilot-vscode`
for a specific host. Then install the plugins:

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-nestjs-nextjs
```

Depending on the configured agent, skills may be exposed as slash commands or invoked by intent, for example
"implement UC-001".

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-nestjs-nextjs
```

See the marketplace [installation guides](../docs/getting-started.md) for other agents and manual adoption.

## Prerequisites

- `aiup-core` and reviewed `docs/entity_model.md` plus `docs/use_cases/UC-*.md` artifacts.
- A NestJS backend using Drizzle ORM over PostgreSQL with `drizzle.config.ts` present.
- A Next.js frontend using the App Router.
- Docker for Testcontainers-backed backend tests.
- Optional Playwright MCP configuration described in [`rules/mcp-servers.md`](rules/mcp-servers.md).

## Inputs and generated artifacts

The plugin consumes the core artifacts under `docs/`, edits the configured Drizzle schema, generates migration
history, creates backend and frontend feature code, and places tests according to the detected project conventions.
`/playwright-test TC-XXX` additionally reads the matching test journey under `docs/test_cases/`.

## Project structure

```text
your-project/
├── docs/
│   ├── entity_model.md
│   ├── use_cases/UC-*.md
│   └── test_cases/TC-*.md
├── apps/api/
│   ├── src/database/schema.ts            # /drizzle-migration
│   ├── drizzle/migrations/               # generated migrations
│   ├── src/<feature>/                    # /implement
│   ├── src/**/*.spec.ts                  # /nest-test unit tests
│   └── test/**/*.e2e-spec.ts             # /nest-test API tests
└── apps/web/
    ├── src/app/<route>/page.tsx          # /implement
    ├── src/**/*.test.tsx                 # /react-test
    └── e2e/*.spec.ts                     # /playwright-test
```

This layout is detected, not required. Separate repositories, different workspace roots, and delegated view
components are supported when the existing project establishes those conventions.

## MCP servers

| Server       | Purpose            |
|--------------|--------------------|
| `playwright` | Browser automation |

NestJS, Drizzle, Next.js, React, Vitest, Supertest, and Testcontainers documentation is available through
`aiup-core`'s `context7` server. See [`rules/mcp-servers.md`](rules/mcp-servers.md) for setup details.

## Related documentation

- [Getting started](../docs/getting-started.md)
- [Workflow and artifacts](../docs/workflow.md)
- [`aiup-core`](../aiup-core/)

## License

Apache-2.0 · © 2025-2026 [Swift Ugandan](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
