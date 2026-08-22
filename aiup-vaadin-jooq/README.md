<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-vaadin-jooq

`aiup-vaadin-jooq` is the AI Unified Process construction plugin for applications built with
[Vaadin](https://vaadin.com) or Hilla and [jOOQ](https://www.jooq.org). It turns the entity model and use case
specifications produced by [`aiup-core`](../aiup-core/) into migrations, application code, and tests.

This plugin is designed to continue from the specifications produced by `aiup-core`. For the complete AI Unified Process workflow,
use it alongside `aiup-core` and select one stack plugin.

## Skills and workflow

| Phase        | Skill                                                   | Result                                                             |
|--------------|---------------------------------------------------------|--------------------------------------------------------------------|
| Construction | [`/flyway-migration`](skills/flyway-migration/SKILL.md) | Versioned Flyway migrations derived from the entity model          |
| Construction | [`/implement`](skills/implement/SKILL.md)               | Vaadin Flow views and jOOQ data access                             |
| Construction | [`/implement-hilla`](skills/implement-hilla/SKILL.md)   | Hilla React views, browser-callable services, and jOOQ data access |
| Construction | [`/browserless-test`](skills/browserless-test/SKILL.md) | Vaadin Browserless server-side tests; recommended for new work     |
| Construction | [`/hilla-test`](skills/hilla-test/SKILL.md)             | Vitest view tests and Spring Boot service tests for Hilla views    |
| Construction | [`/karibu-test`](skills/karibu-test/SKILL.md)           | Karibu server-side tests for existing Karibu projects              |
| Construction | [`/playwright-test`](skills/playwright-test/SKILL.md)   | Playwright tests using Drama Finder for `UC-*` or `TC-*` artifacts |
| Construction | [`/coverage-check`](skills/coverage-check/SKILL.md)     | Coverage matrix, gaps, and drift for a `UC-*` or `TC-*`            |

```text
Construction
─────────────────────────────────────────────────────────────────────
/flyway-migration  →  /implement  →  /browserless-test  →  /coverage-check
                                  ↘  /playwright-test  (UC-* or TC-*)  ↗
```

Use `/implement-hilla` instead of `/implement` for Hilla, followed by `/hilla-test` for its Vitest frontend tests and
Spring Boot backend tests. Since Vaadin 25.1, Browserless Testing is the recommended server-side option for Flow views;
`/karibu-test` remains available for codebases that already use Karibu.

The linked `SKILL.md` files are the authoritative reference for detailed inputs, outputs, and behavior.

## Sub-agent

| Agent                                  | Purpose                                                                   |
|----------------------------------------|---------------------------------------------------------------------------|
| [`uc-coverage`](agents/uc-coverage.md) | Audits whether a `UC-XXX` or `TC-XXX` is completely implemented and tested |

`uc-coverage` is the review step of the construction phase. It maps every main success scenario step, alternative
flow, business rule, precondition, and postcondition of a specification onto the code and tests that realize it, and
reports three things: the gaps, the drift (code or tests the specification no longer describes), and the
specification's justified next `**Status:**` value.

The agent is **read-only** — it never edits code, tests, or the specification. The implementation and testing skills
above call it as their last step, each for its own side. [`/coverage-check`](skills/coverage-check/SKILL.md) is the
front door for calling it yourself — at the end of a construction round, before a review, or mid-way through a large
use case with "work in progress" so it lists remaining work instead of defects:

```text
/coverage-check UC-001                 # implementation and tests in one matrix
/coverage-check UC-001 implementation  # narrow the audit to one side
/coverage-check TC-001                 # a journey audits its Flow rows and Validation items
```

In Claude Code it is available as a sub-agent once the plugin is installed. Hosts without sub-agent support can use
[`agents/uc-coverage.md`](agents/uc-coverage.md) as an instruction document — its checklist does not depend on
Claude Code. The traceability markers it searches for (`@UseCase`, `UC<id>…Test`, `describe('UC-XXX: …')`, `@UC-XXX`)
are the ones the skills above produce.

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
tessl install ai-unified-process/aiup-vaadin-jooq
```

Depending on the configured agent, skills may be exposed as slash commands or invoked by intent, for example
"implement UC-001".

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-vaadin-jooq
```

See the marketplace [installation guides](../docs/getting-started.md) for other agents and manual adoption.

## Prerequisites

- `aiup-core` and reviewed `docs/entity_model.md` plus `docs/use_cases/UC-*.md` artifacts.
- A Maven or Gradle project with Vaadin and jOOQ on the classpath.
- Optional MCP servers configured as described in [`rules/mcp-servers.md`](rules/mcp-servers.md).
- A running application for browser-based Playwright tests.

## Inputs and generated artifacts

Migration and implementation skills consume the entity model and individual use case specifications. A
`/playwright-test TC-XXX` journey additionally consumes `docs/test_cases/TC-*.md`.

The plugin writes Flyway migrations, Vaadin or Hilla implementation classes, server-side tests, and browser tests into
the target project's existing Maven or Gradle layout.

## Project structure

The common Vaadin Flow layout is:

```text
your-project/
├── docs/
│   ├── entity_model.md
│   ├── use_cases/UC-*.md
│   └── test_cases/TC-*.md
└── src/
    ├── main/
    │   ├── java/                         # /implement
    │   ├── frontend/views/               # /implement-hilla
    │   └── resources/db/migration/       # /flyway-migration
    └── test/
        ├── java/                         # server-side and Playwright tests
        └── resources/db/migration/       # test data seeds
```

The skills inspect the existing code and build files before choosing packages and paths; the tree above is illustrative,
not a required project skeleton.

## MCP servers

| Server          | Purpose                                              |
|-----------------|------------------------------------------------------|
| `Vaadin`        | Component APIs, framework documentation, and theming |
| `KaribuTesting` | Karibu test APIs and migration guidance              |
| `jOOQ`          | Query DSL, code generation, and SQL references       |
| `JavaDocs`      | Java APIs available on the project classpath         |
| `playwright`    | Browser automation                                   |

See [`rules/mcp-servers.md`](rules/mcp-servers.md) for optional-server behavior and setup details.

## Related documentation

- [Getting started](../docs/getting-started.md)
- [Workflow and artifacts](../docs/workflow.md)
- [`aiup-core`](../aiup-core/)

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
