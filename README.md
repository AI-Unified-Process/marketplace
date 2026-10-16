<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# AI Unified Process Marketplace

AI Unified Process is a requirements-first workflow for taking software from a product vision to reviewed
specifications, implementation, and traceable tests. This repository distributes the workflow as portable Agent
Plugins and Agent Skills for Claude Code, OpenAI Codex, Cursor, GitHub Copilot, Gemini CLI, OpenCode, and other
compatible coding agents.

[Get started](docs/getting-started.md) · [Understand the workflow](docs/workflow.md) ·
[Choose a plugin](#choose-your-plugins) · [Installation guides](#installation)

## Why AI Unified Process?

AI-assisted development often jumps from a vague prompt directly to code. AI Unified Process inserts durable,
human-reviewable artifacts between intent and implementation:

- requirements with stable identifiers;
- an explicit domain entity model;
- use cases that define user goals and behavior;
- test journeys that trace back to those use cases;
- stack-specific implementation and tests built from the reviewed specifications.

The workflow is inspired by the phases of the
[Rational Unified Process](https://en.wikipedia.org/wiki/Rational_unified_process), adapted for coding agents and
plain-text artifacts that live with the source code.

## Workflow

```text
Inception          Elaboration                            Construction
─────────────     ───────────────────────────────────     ─────────────────────────────────
/requirements  →  /entity-model  →  /use-case-diagram  →  /use-case-spec  →  migration
                                                                          ↘  implementation
                                                                          ↘  tests
```

`aiup-core` owns the stack-independent path from vision to specifications. Construction continues either with
layer plugins — one per technology, combined per project and run by `/use-case-implement` and `/use-case-test` in `aiup-core` —
or with one combined stack plugin.

Each step reads the files produced by earlier steps. You can review or edit an artifact before continuing, and every
later result remains traceable to the corresponding requirement or use case.

[Read about phases, artifacts, traceability, and change handling →](docs/workflow.md)

## Choose your plugins

Install `aiup-core` in every project. For construction, combine **layer plugins** — one per technical layer — or add
exactly one **combined stack plugin**. Do not mix both in one project.

### Layer plugins

Pick one plugin per layer the project has. `/architecture` records the combination in the Development View,
`docs/architecture/development.md`; `/use-case-implement UC-001` runs the layer skills bottom-up, `/use-case-test UC-001` writes
the tests from the integration layer up — the topmost layer whose tests run in process against the real database,
except an API next to a Vaadin Flow or Hilla UI that does not call it, so the layers below need no tests of their own
(that API still gets its own contract tests when the use case is offered through it) — and `/use-case-coverage UC-001`
audits the result. A use case offered through only some entry
points (an administration screen without an API) says so in its `**Layers:**` line, and only those layers are built
and tested.

| Plugin                                  | Layer                 | Skills                                                                                       |
|-----------------------------------------|-----------------------|----------------------------------------------------------------------------------------------|
| [`aiup-flyway`](aiup-flyway/)           | Migration             | `/flyway-schema`                                                                             |
| [`aiup-jooq`](aiup-jooq/)               | Persistence           | `/jooq-persistence`, `/jooq-persistence-test`                                                |
| [`aiup-jpa`](aiup-jpa/)                 | Persistence           | `/jpa-persistence`, `/jpa-persistence-test`                                                  |
| [`aiup-spring-boot`](aiup-spring-boot/) | Service, REST API     | `/spring-service`, `/spring-rest`, `/spring-service-test`, `/spring-rest-test`               |
| [`aiup-vaadin`](aiup-vaadin/)           | UI (Flow, Hilla), E2E | `/vaadin-flow-ui`, `/hilla-ui`, `/vaadin-flow-ui-test`, `/hilla-ui-test`, `/vaadin-e2e-test` |
| [`aiup-angular`](aiup-angular/)         | UI                    | `/angular-ui`, `/angular-ui-test`                                                            |
| [`aiup-playwright`](aiup-playwright/)   | E2E (TypeScript)      | `/playwright-e2e-test`                                                                       |

| Project                     | Plugins next to `aiup-core`                                                      |
|-----------------------------|----------------------------------------------------------------------------------|
| REST API, Spring Boot, jOOQ | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`                                   |
| REST API, Spring Boot, JPA  | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`                                    |
| Vaadin Flow or Hilla, jOOQ  | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    |
| Vaadin Flow and a REST API  | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    |
| Angular, Spring Boot, JPA   | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`, `aiup-angular`, `aiup-playwright` |

### Combined stack plugins

| Plugin                                      | Stack and responsibility                      | Construction skills                                                                                                                             |
|---------------------------------------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| [`aiup-vaadin-jooq`](aiup-vaadin-jooq/)     | Vaadin Flow or Hilla with jOOQ (deprecated)   | Flyway, implementation, Browserless or Karibu, Playwright, coverage check                                                                       |
| [`aiup-angular-jpa`](aiup-angular-jpa/)     | Angular with Spring Boot and JPA (deprecated) | Flyway, implementation, Spring Boot tests, Vitest, Playwright, coverage check                                                                   |
| [`aiup-blazor-dotnet`](aiup-blazor-dotnet/) | C# and Blazor on .NET 10 with EF Core         | EF migrations, Vertical Slices, bUnit, xUnit, Playwright                                                                                        |
| [`aiup-nestjs-nextjs`](aiup-nestjs-nextjs/) | NestJS and Drizzle with Next.js App Router    | Drizzle migrations, implementation, Vitest, Supertest, React Testing Library, Playwright                                                        |

`aiup-vaadin-jooq` and `aiup-angular-jpa` additionally ship a read-only `uc-coverage`
sub-agent ([Vaadin](aiup-vaadin-jooq/agents/uc-coverage.md), [Angular](aiup-angular-jpa/agents/uc-coverage.md)). It reports which parts of the specification have no code or no test behind them, and which code has no
specification behind it. The `/coverage-check` skill of each plugin runs that
audit on demand and judges implementation and tests together; the implementation and testing skills end by handing
off to it rather than running it themselves, so a construction round stays fast.

`aiup-vaadin-jooq` and `aiup-angular-jpa` are deprecated in favour of the layer plugins and will be removed with
`aiup-core` 4.0.0. The [migration guide](docs/migration.md) walks an existing project through the switch.
`aiup-blazor-dotnet` stays a combined plugin: its Vertical Slice Architecture keeps a use case's handler and data
access together in one slice, which horizontal layer plugins would split apart.

`aiup-core` itself ships `/requirements`, `/entity-model`, `/use-case-diagram`, `/use-case-spec`, `/business-process`,
`/test-case`, `/spec-review`, `/reverse-engineer`, and, for layer plugins, `/architecture`, `/use-case-implement`,
`/use-case-test`, `/use-case-coverage`, `/test-case-implement`, and `/test-case-coverage`.

Use only `aiup-core` when working with another implementation stack. The methodology ends at a documented boundary,
so the specifications can feed a custom implementation workflow.

## Quick start

Before installing AI Unified Process, create `docs/vision.md` in the target project. It should describe the mission, target users,
goals, scope, and constraints. A copy-ready [vision template](docs/templates/vision.md) is available.

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-flyway
/plugin install aiup-jooq
/plugin install aiup-spring-boot
```

This example is a REST API with Spring Boot and jOOQ; install the layer plugins of your project, or one combined
stack plugin instead.

### Any supported agent through Tessl

```sh
tessl init --agent agents
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-flyway
tessl install ai-unified-process/aiup-jooq
tessl install ai-unified-process/aiup-spring-boot
```

Tessl installs versioned skills and maps each plugin's MCP servers (its bundled `.mcp.json`) into the configured agent
layout.
Replace `agents` with a host-specific identifier such as `claude-code`, `cursor`, `gemini`, `codex`, `copilot`, or
`copilot-vscode` when you do not want the vendor-neutral layout.

### Create the first artifacts

Run the core skills in the target project:

```text
/requirements
/entity-model
/use-case-diagram
/use-case-spec UC-001
```

Agents that do not expose skills as slash commands can invoke them by intent, for example: "Create the requirements
catalog from `docs/vision.md`" or "Specify UC-001".

[Follow the complete getting-started guide →](docs/getting-started.md)

## Generated artifacts

The stack-independent workflow creates a shared documentation contract:

```text
docs/
├── vision.md                         # maintained by the team
├── requirements.md                   # /requirements
├── glossary.md                       # /requirements (domain terms and synonyms to avoid)
├── entity_model.md                   # /entity-model
├── use_cases.puml                    # /use-case-diagram
├── processes/
│   └── BP-001-*.bpmn                 # /business-process (optional), read by /test-case
├── use_cases/
│   └── UC-001-*.md                   # /use-case-spec
├── test_cases/
│   └── TC-001-*.md                   # /test-case
└── architecture/                     # /architecture (layer plugins only)
    ├── README.md                     # index of the 4+1 views
    └── development.md                # Development View: layer → technology → skill → test skill
```

Stack plugins consume these files and place generated code and tests according to the conventions of the target
project. Their READMEs document the supported layouts and exact prerequisites.

## Existing applications

Start an undocumented application with:

```text
/reverse-engineer
```

The skill inspects entry points, domain models, schema, authentication, and integrations, then proposes an entity
model, use case diagram, and individual use case specifications. It reports behavior it cannot classify so the team
can review gaps before adopting the result as a baseline.

## Installation

- [Claude Code](docs/installation/claude-code.md) — add the marketplace and install plugins directly.
- [Tessl](docs/installation/tessl.md) — install pinned plugins for one or more supported agents.
- [Agent Plugins and manual setup](docs/installation/other-agents.md) — direct packages, skill locations, MCP examples,
  and host-specific caveats.

Every plugin directory contains:

- a Claude Code manifest and MCP configuration;
- an Agent Plugins v1.0.0 `plugin.json` and `mcp.json`;
- portable Agent Skills under `skills/`;
- sub-agent definitions under `agents/`, where the plugin ships one;
- a Tessl package manifest;
- evaluation scenarios used during publication.

CI keeps the three plugin manifest formats and their MCP definitions in sync, and verifies that every
skill and document carries its copyright header and that each plugin ships `LICENSE` and `NOTICE`.

## Documentation

| Guide                                                        | Contents                                                                                     |
|--------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| [Getting started](docs/getting-started.md)                   | Select plugins, prepare a vision, install AI Unified Process, and create the first artifacts |
| [Workflow and artifacts](docs/workflow.md)                   | Phases, traceability, artifact ownership, changes, and legacy projects                       |
| [Migration guide](docs/migration.md)                         | Moving a project from `aiup-vaadin-jooq` or `aiup-angular-jpa` to the layer plugins          |
| [Project setup](docs/guides/project-setup.md)                | Recommended project documentation tree and agent guidance                                    |
| [Writing a layer skill](docs/guides/layer-skill.md)          | The contract a team's own layer skill fulfils to run under `/use-case-implement`             |
| [Vision template](docs/templates/vision.md)                  | Starting point for `docs/vision.md`                                                          |
| [CLAUDE.md template](docs/templates/CLAUDE.md)               | Stack-neutral repository instructions for Claude Code                                        |
| [Complete tutorial](https://unifiedprocess.ai/tutorial.html) | Book Library example: stack-neutral analysis followed by Vaadin/jOOQ construction            |

Detailed skill behavior is documented in each plugin's `skills/*/SKILL.md`. Those files are the authoritative source
for inputs, outputs, safety constraints, and execution steps; READMEs provide navigation and concise summaries.

## Repository layout

```text
marketplace/
├── aiup-core/
├── aiup-vaadin-jooq/
├── aiup-angular-jpa/
├── aiup-blazor-dotnet/
├── aiup-nestjs-nextjs/
├── aiup-flyway/
├── aiup-jooq/
├── aiup-jpa/
├── aiup-spring-boot/
├── aiup-vaadin/
├── aiup-angular/
├── aiup-playwright/
├── docs/
├── pipelines/
└── scripts/
```

## Learn more

Visit [unifiedprocess.ai](https://unifiedprocess.ai) for the broader methodology.

## License

Licensed under the [Apache License 2.0](LICENSE).

## Copyright and trademark

Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors. The skills and documentation
are licensed under Apache 2.0. "AI Unified Process" identifies the original methodology by Simon Martinelli
([unifiedprocess.ai](https://unifiedprocess.ai)). You may fork and modify this work under the license terms,
but derived works must keep the [NOTICE](NOTICE) file and may not present themselves as the official
AI Unified Process. If you build on it, please say so and link to this repository.
