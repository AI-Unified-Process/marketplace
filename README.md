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

`aiup-core` owns the stack-independent path from vision to specifications. One stack plugin continues from those
specifications into migrations, application code, and tests.

Each step reads the files produced by earlier steps. You can review or edit an artifact before continuing, and every
later result remains traceable to the corresponding requirement or use case.

[Read about phases, artifacts, traceability, and change handling →](docs/workflow.md)

## Choose your plugins

Install `aiup-core` in every project. Add exactly one stack plugin when AI Unified Process supports the project's implementation
stack.

| Plugin                                      | Stack and responsibility                      | Construction skills                                                                                        |
|---------------------------------------------|-----------------------------------------------|------------------------------------------------------------------------------------------------------------|
| [`aiup-core`](aiup-core/)                   | Stack-independent analysis and specifications | `/requirements`, `/entity-model`, `/use-case-diagram`, `/use-case-spec`, `/test-case`, `/reverse-engineer` |
| [`aiup-vaadin-jooq`](aiup-vaadin-jooq/)     | Vaadin Flow or Hilla with jOOQ                | Flyway, implementation, Browserless or Karibu, Playwright, coverage check                                 |
| [`aiup-angular-jpa`](aiup-angular-jpa/)     | Angular with Spring Boot and JPA              | Flyway, implementation, Spring Boot tests, Vitest, Playwright                                              |
| [`aiup-blazor-dotnet`](aiup-blazor-dotnet/) | C# and Blazor on .NET 10 with EF Core         | EF migrations, Vertical Slices, bUnit, xUnit, Playwright                                                   |
| [`aiup-nestjs-nextjs`](aiup-nestjs-nextjs/) | NestJS and Drizzle with Next.js App Router    | Drizzle migrations, implementation, Vitest, Supertest, React Testing Library, Playwright                   |

`aiup-vaadin-jooq` additionally ships the read-only [`uc-coverage`](aiup-vaadin-jooq/agents/uc-coverage.md)
sub-agent. Its implementation and testing skills hand each use case to it as their last step, and it reports which
parts of the specification have no code or no test behind them, and which code has no specification behind it. The
[`/coverage-check`](aiup-vaadin-jooq/skills/coverage-check/SKILL.md) skill runs that audit on demand and judges
implementation and tests together.

Use only `aiup-core` when working with another implementation stack. The methodology ends at a documented boundary,
so the specifications can feed a custom implementation workflow.

## Quick start

Before installing AI Unified Process, create `docs/vision.md` in the target project. It should describe the mission, target users,
goals, scope, and constraints. A copy-ready [vision template](docs/templates/vision.md) is available.

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-vaadin-jooq
```

Replace `aiup-vaadin-jooq` with the selected stack plugin.

### Any supported agent through Tessl

```sh
tessl init --agent agents
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-vaadin-jooq
```

Tessl installs versioned skills and maps their MCP servers into the configured agent layout.
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
├── entity_model.md                   # /entity-model
├── use_cases.puml                    # /use-case-diagram
├── use_cases/
│   └── UC-001-*.md                   # /use-case-spec
└── test_cases/
    └── TC-001-*.md                   # /test-case
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
| [Project setup](docs/guides/project-setup.md)                | Recommended project documentation tree and agent guidance                                    |
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
├── docs/
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
