<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Getting started

AI Unified Process turns a product vision into reviewed specifications, implementation, and traceable tests.
Use `aiup-core` for the stack-independent analysis workflow and add exactly one stack plugin for implementation.

## 1. Choose your plugins

Every project needs `aiup-core`. Add the plugin that matches the application's implementation stack.

| Plugin                                         | Use it for                                                                    |
|------------------------------------------------|-------------------------------------------------------------------------------|
| [`aiup-core`](../aiup-core/)                   | Requirements, entity model, use cases, test journeys, and reverse engineering |
| [`aiup-vaadin-jooq`](../aiup-vaadin-jooq/)     | Vaadin Flow or Hilla with jOOQ                                                |
| [`aiup-angular-jpa`](../aiup-angular-jpa/)     | Angular with a Spring Boot/JPA backend                                        |
| [`aiup-blazor-dotnet`](../aiup-blazor-dotnet/) | Blazor and EF Core on .NET 10                                                 |
| [`aiup-nestjs-nextjs`](../aiup-nestjs-nextjs/) | NestJS/Drizzle and Next.js App Router                                         |

Install only `aiup-core` when you want to use the analysis workflow with an unsupported implementation stack.

## 2. Prepare the product vision

Create `docs/vision.md` in the project where AI Unified Process will run. Describe the problem, target users, goals, scope, and
constraints. Start from the [vision template](templates/vision.md) if the project does not have one yet.

The quality of the requirements catalog depends on the quality of this input. Prefer concrete goals and explicit
non-goals over a long feature wish list.

## 3. Install the plugins

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-vaadin-jooq
```

Replace `aiup-vaadin-jooq` with the selected stack plugin. See the full
[Claude Code installation guide](installation/claude-code.md).

### Tessl

```sh
tessl init --agent agents
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-vaadin-jooq
```

Tessl can configure several supported coding agents and pins installed versions in `tessl.json`. See the full
[Tessl installation guide](installation/tessl.md). Replace the vendor-neutral `agents` identifier with
`claude-code`, `cursor`, `gemini`, `codex`, `copilot`, or `copilot-vscode` when configuring a specific host layout.

For direct Agent Plugins adoption or manual setup in Codex, Cursor, Copilot, Gemini CLI, and OpenCode, see
[Agent Plugins and manual installation](installation/other-agents.md).

## 4. Run the core workflow

Start the coding agent in the target project and create the analysis artifacts in order:

```text
/requirements
/entity-model
/use-case-diagram
/use-case-spec UC-001
```

Review every generated file before continuing. The artifacts are deliberately plain Markdown, Mermaid, and PlantUML
so a team can correct them in version control without running a skill again.

The core workflow produces:

```text
docs/
├── vision.md
├── requirements.md
├── entity_model.md
├── use_cases.puml
└── use_cases/
    └── UC-001-*.md
```

If the agent starts by reading `docs/vision.md` after `/requirements`, the core plugin is available. If the command is
not exposed as a slash command by the selected agent, ask it to "generate the requirements catalog from the product
vision"; Agent Skills can also be activated by intent.

## 5. Implement and test

Once a use case specification exists, continue with the commands from the selected stack plugin. For example, the
construction workflow normally consists of a migration, `/implement UC-001`, stack-specific unit or integration tests,
and `/playwright-test UC-001`.

For a journey across several use cases, first create a test-case document:

```text
/test-case UC-001 UC-004
/playwright-test TC-001
```

The `aiup-vaadin-jooq` implementation and testing skills end by handing off to a coverage check they do not run
themselves: [`/coverage-check UC-001`](../aiup-vaadin-jooq/skills/coverage-check/SKILL.md) delegates to the read-only
[`uc-coverage`](../aiup-vaadin-jooq/agents/uc-coverage.md) sub-agent that ships with that plugin, which reports which
parts of the specification still have no code or no test behind them. Run it when you want the audit — typically
before accepting a use case as done, when it judges implementation and tests together in one matrix.

The exact commands, prerequisites, generated paths, and testing conventions are documented in each plugin README.
The complete artifact lifecycle is described in [Workflow and artifacts](workflow.md).

## Existing projects

When a project already contains working code but lacks AI Unified Process documents, start with:

```text
/reverse-engineer
```

The skill recovers an entity model, use case diagram, and use case specifications from the codebase. Review the
reported gaps before using those artifacts as the baseline for further work.

## Complete example

The [Book Library tutorial](https://unifiedprocess.ai/tutorial.html) demonstrates the complete workflow. Its first
five steps are stack-independent; steps six through nine use the Vaadin and jOOQ plugin for construction and testing.
