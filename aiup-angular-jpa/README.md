<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-angular-jpa

`aiup-angular-jpa` is the AI Unified Process construction plugin for an [Angular](https://angular.dev) frontend and a
[Spring Boot](https://spring.io/projects/spring-boot) backend using JPA/Hibernate. It turns the artifacts produced by
[`aiup-core`](../aiup-core/) into database migrations, a REST API, an Angular UI, and tests across both applications.

This plugin is designed to continue from the specifications produced by `aiup-core`. For the complete AI Unified Process workflow,
use it alongside `aiup-core` and select one stack plugin.

## Architecture support

The backend skills detect and follow either of these established project shapes:

- **Flat single module:** entities, repositories, services, and controllers in one Spring Boot module.
- **Hexagonal multi-module:** separate domain, business, persistence adapter, inbound adapter, and composition-root
  modules with ports and adapters enforced by Maven boundaries.

Existing asymmetric conventions are preserved instead of being rewritten into a textbook architecture. The shared
detection rules are documented in
[`skills/implement/references/module-layout.md`](skills/implement/references/module-layout.md).

## Skills and workflow

| Phase        | Skill                                                   | Result                                                             |
|--------------|---------------------------------------------------------|--------------------------------------------------------------------|
| Construction | [`/flyway-migration`](skills/flyway-migration/SKILL.md) | Flyway migrations placed in the detected persistence module        |
| Construction | [`/implement`](skills/implement/SKILL.md)               | Spring Boot API and Angular UI following the existing architecture |
| Construction | [`/spring-boot-test`](skills/spring-boot-test/SKILL.md) | Backend integration tests using the project's detected convention  |
| Construction | [`/vitest-test`](skills/vitest-test/SKILL.md)           | Angular component tests with TestBed and HttpTestingController     |
| Construction | [`/playwright-test`](skills/playwright-test/SKILL.md)   | Browser tests for a `UC-*` or end-to-end journeys for a `TC-*`     |
| Construction | [`/coverage-check`](skills/coverage-check/SKILL.md)     | Coverage matrix, gaps, and drift for a `UC-*` or `TC-*`            |

```text
Construction
─────────────────────────────────────────────────────────────────────────────
/flyway-migration  →  /implement  →  /spring-boot-test  →  /vitest-test  →  /coverage-check
                                  ↘  /playwright-test  (UC-* or TC-*)             ↗
```

Each skill ends with one `Next:` line naming the following command. The linked `SKILL.md` files are the authoritative
reference for detailed inputs, outputs, and behavior.

## Sub-agent

| Agent                                  | Purpose                                                                    |
|----------------------------------------|----------------------------------------------------------------------------|
| [`uc-coverage`](agents/uc-coverage.md) | Audits whether a `UC-XXX` or `TC-XXX` is completely implemented and tested |

`uc-coverage` is the review step of the construction phase. It maps every main success scenario step, alternative
flow, business rule, precondition, postcondition, and linked NFR and constraint of a specification onto the Spring
Boot and Angular code and the tests that realize it, and reports the gaps, the drift (code or tests the specification no longer describes), and the
specification's justified next `**Status:**` value.

The agent is **read-only** — it never edits code, tests, or the specification. The implementation and testing skills
do not run it; they hand off to [`/coverage-check`](skills/coverage-check/SKILL.md), the one place the audit runs:

```text
/coverage-check UC-001                 # implementation and tests in one matrix
/coverage-check UC-001 implementation  # narrow the audit to one side
/coverage-check TC-001                 # a journey audits its Flow rows and Validation items
```

In Claude Code it is available as a sub-agent once the plugin is installed. Hosts without sub-agent support can use
[`agents/uc-coverage.md`](agents/uc-coverage.md) as an instruction document. The traceability markers it searches for
(`@UseCase`, `UC<id>…Test`, `describe('UC-XXX: …')`, `@UC-XXX`, `@TC-XXX`) are the ones the skills above produce.

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
tessl install ai-unified-process/aiup-angular-jpa
```

Depending on the configured agent, skills may be exposed as slash commands or invoked by intent, for example
"implement UC-001".

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-angular-jpa
```

See the marketplace [installation guides](../docs/getting-started.md) for other agents and manual adoption.

## Prerequisites

- `aiup-core` and reviewed `docs/entity_model.md` plus `docs/use_cases/UC-*.md` artifacts.
- A Maven or Gradle backend with Spring Boot, Spring Data JPA, and Flyway.
- An Angular frontend using standalone components.
- Docker when the project's integration-test convention uses Testcontainers.
- Optional MCP servers configured through [`rules/mcp-servers.md`](rules/mcp-servers.md).

## Inputs and generated artifacts

All construction skills consume the core artifacts under `docs/`. They write migrations and backend code into the
detected Spring module, Angular pages and services into the existing frontend layout, and tests alongside their
respective application.

## Project structure

### Flat backend

```text
your-project/
├── docs/
├── backend/
│   └── src/
│       ├── main/java/                    # /implement
│       ├── main/resources/db/migration/  # /flyway-migration
│       └── test/java/                    # /spring-boot-test
└── frontend/
    ├── src/app/                          # /implement and /vitest-test
    └── tests/e2e/                        # /playwright-test
```

### Hexagonal backend

```text
backend/
├── <domain-module>/                      # pure domain types
├── <business-module>/                    # services, ports, and DTOs
├── <persistence-module>/                 # JPA adapter and Flyway migrations
├── <api-module>/                         # REST controllers
└── <app-module>/                         # composition root and integration tests
```

Module names and frontend locations are detected from the project; these trees illustrate responsibilities rather
than prescribe exact names.

## MCP servers

| Server       | Purpose                                                            |
|--------------|--------------------------------------------------------------------|
| `JavaDocs`   | Spring, Hibernate, RestAssured, Testcontainers, and classpath APIs |
| `playwright` | Browser automation                                                 |

General npm package documentation is available through `aiup-core`'s `context7` server. See
[`rules/mcp-servers.md`](rules/mcp-servers.md) for setup details.

## Related documentation

- [Getting started](../docs/getting-started.md)
- [Workflow and artifacts](../docs/workflow.md)
- [`aiup-core`](../aiup-core/)

## License

Apache-2.0 · © 2025-2026 [Marc Affolter](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
