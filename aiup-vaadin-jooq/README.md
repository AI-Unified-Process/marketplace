# aiup-vaadin-jooq

`aiup-vaadin-jooq` is the AIUP construction plugin for applications built with
[Vaadin](https://vaadin.com) or Hilla and [jOOQ](https://www.jooq.org). It turns the entity model and use case
specifications produced by [`aiup-core`](../aiup-core/) into migrations, application code, and tests.

This plugin is designed to continue from the specifications produced by `aiup-core`. For the complete AIUP workflow,
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

```text
Construction
─────────────────────────────────────────────────────────────────────
/flyway-migration  →  /implement  →  /browserless-test
                                  ↘  /playwright-test  (UC-* or TC-*)
```

Use `/implement-hilla` instead of `/implement` for Hilla, followed by `/hilla-test` for its Vitest frontend tests and
Spring Boot backend tests. Since Vaadin 25.1, Browserless Testing is the recommended server-side option for Flow views;
`/karibu-test` remains available for codebases that already use Karibu.

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

Apache-2.0 · © [Simon Martinelli](https://unifiedprocess.ai)
