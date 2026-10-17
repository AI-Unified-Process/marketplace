<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Getting started

AI Unified Process turns a product vision into reviewed specifications, implementation, and traceable tests.
Use `aiup-core` for the stack-independent analysis workflow and add the layer plugins of your stack, or one combined
stack plugin, for implementation.

## 1. Choose your plugins

Every project needs [`aiup-core`](../aiup-core/): requirements, entity model, use cases, test journeys, reverse
engineering, and the construction orchestrators for layer plugins. For construction, choose one of two forms.

**Layer plugins** — one plugin per technical layer, combined to fit the project. A REST API with Spring Boot and jOOQ
needs `aiup-flyway`, `aiup-jooq`, and `aiup-spring-boot`; add `aiup-vaadin` for a Vaadin UI, or `aiup-angular` and
`aiup-playwright` for an Angular UI; take `aiup-jpa` instead of `aiup-jooq` for JPA.

| Plugin                                     | Layer                                         |
|--------------------------------------------|-----------------------------------------------|
| [`aiup-flyway`](../aiup-flyway/)           | Migration: Flyway SQL migrations              |
| [`aiup-jooq`](../aiup-jooq/)               | Persistence: jOOQ                             |
| [`aiup-jpa`](../aiup-jpa/)                 | Persistence: JPA/Hibernate                    |
| [`aiup-spring-boot`](../aiup-spring-boot/) | Service and REST API: Spring Boot             |
| [`aiup-vaadin`](../aiup-vaadin/)           | UI: Vaadin Flow or Hilla, with Playwright E2E |
| [`aiup-angular`](../aiup-angular/)         | UI: Angular                                   |
| [`aiup-playwright`](../aiup-playwright/)   | E2E: Playwright for TypeScript                |

**Combined stack plugins** — one plugin for a fixed combination. Install exactly one, and no layer plugins next to it.

| Plugin                                         | Use it for                                                                    |
|------------------------------------------------|-------------------------------------------------------------------------------|
| [`aiup-vaadin-jooq`](../aiup-vaadin-jooq/)     | Vaadin Flow or Hilla with jOOQ (deprecated: use the layer plugins)            |
| [`aiup-angular-jpa`](../aiup-angular-jpa/)     | Angular with a Spring Boot/JPA backend (deprecated: use the layer plugins)    |
| [`aiup-blazor-dotnet`](../aiup-blazor-dotnet/) | Blazor and EF Core on .NET 10                                                 |
| [`aiup-nestjs-nextjs`](../aiup-nestjs-nextjs/) | NestJS/Drizzle and Next.js App Router                                         |

Install only `aiup-core` when you want to use the analysis workflow with an unsupported implementation stack. A project
that already uses `aiup-vaadin-jooq` or `aiup-angular-jpa` follows the [migration guide](migration.md).

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
/plugin install aiup-flyway
/plugin install aiup-jooq
/plugin install aiup-spring-boot
```

Install the layer plugins of your stack, or one combined stack plugin instead. See the full
[Claude Code installation guide](installation/claude-code.md).

### Tessl

```sh
tessl init --agent agents
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-flyway
tessl install ai-unified-process/aiup-jooq
tessl install ai-unified-process/aiup-spring-boot
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

Before a use case moves to Approved, review the specifications against each other:

```text
/spec-review UC-001
```

The review has two parts. A bundled script (`spec_lint.py`, Python only) reports what is certain: a use case of the
diagram without a specification, duplicated ids, references to requirements, rules, or use cases that do not exist,
uncovered functional requirements, BPMN activities without a use case, weak words, and synonyms the glossary says to
avoid. The same script can fail a CI build. The agent then adds advisory findings that need judgment: contradicting
or duplicated business rules, UI or technical detail in a use case, steps that can fail without an alternative flow,
untestable rules, wrong or missing actors, unreferenced NFRs and constraints, and data that does not match the
entity model. The skill reports only; fixes go through
`/use-case-spec`, `/requirements`, or `/use-case-diagram`.

To see the state of the whole project on one page, generate the HTML report:

```text
/spec-review report
```

It writes `docs/spec-report.html` with the requirement coverage (which requirements are linked to a use case, reached
by a test case, and verified), the traceability matrix from requirement to use case, business rules, and test cases,
and the lint findings. `/spec-review report UC-001` narrows it to one id. Open the file in a browser; the ids link to
the specification files.

## 5. Implement and test

Once a use case specification exists, continue with construction. With layer plugins, record the stack once and
then work use case by use case:

```text
/architecture
/use-case-implement UC-001
/use-case-test UC-001
/use-case-coverage UC-001
```

`/architecture` writes the Development View, the table of which layer skill builds and tests each layer, as
`docs/architecture/development.md` with the index `docs/architecture/README.md`. A use case offered through only some
entry points names them in its `**Layers:**` line (`UI`, `API`, or `Service`), and the next two commands build and
test only those layers.
`/use-case-implement` runs the layer skills bottom-up — migration, persistence, service, API, UI — and `/use-case-test` writes the
tests from the integration layer up: starting at the entry layer the use case is offered through, the first layer
whose tests run in process against the real database (the Browserless tests of a Vaadin Flow UI, the service tests
behind a Hilla UI, the API tests of a REST service), so the layers below it need no tests of their own. A REST API
next to a UI that does not call it (Vaadin Flow, Hilla) is the integration layer only of the use cases offered
through it alone; when a use case is offered through it as well, `/use-case-test` writes its contract tests too, even though it sits below the
integration layer. Both take a layer to narrow the run, for example `/use-case-implement UC-001 api` or `/use-case-test UC-001
persistence` for a lower layer.

With a combined stack plugin, use its commands instead. For example, the construction workflow normally consists of a
migration, `/implement UC-001`, stack-specific unit or integration tests, and `/playwright-test UC-001`.

For a journey across several use cases, first create a test-case document:

```text
/test-case UC-001 UC-004
/test-case-implement TC-001      # layer plugins; /playwright-test TC-001 with a combined stack plugin
/test-case-coverage TC-001       # layer plugins; /coverage-check TC-001 with aiup-vaadin-jooq or aiup-angular-jpa
```

When several use cases form one business process — work handed over between roles, waiting for an event or a
deadline, parallel branches — model the process in BPMN 2.0 and derive one test case per path through it.
`/business-process` reads the requirements and the use case diagram, proposes the processes, and writes each
one to `docs/processes/BP-XXX-<name>.bpmn` with a diagram layout that bpmn.io or the process editor of AI Unified
Studio can open. Every process has a `BP-XXX` id; pass it to update that one process:

```text
/business-process
/business-process BP-001
/test-case BP-001
```

Each activity of the process must map to a use case of the diagram — by a use case id in the activity name
(`UC-001 Place Order`) or by the use case name. The use cases need no specification yet, so you can model the process
right after `/use-case-diagram`; `/test-case` needs the specifications, though. `/business-process` stops and proposes
the missing use cases instead of modeling an activity without one, and `/test-case` stops and lists activities without
a specified use case.

The `aiup-vaadin-jooq` and `aiup-angular-jpa` implementation and testing skills end by handing off to a coverage check
they do not run themselves: `/coverage-check UC-001` delegates to the read-only `uc-coverage` sub-agent that ships with
the plugin ([Vaadin](../aiup-vaadin-jooq/agents/uc-coverage.md), [Angular](../aiup-angular-jpa/agents/uc-coverage.md)), which reports which
parts of the specification still have no code or no test behind them. Run it when you want the audit — typically
before accepting a use case as done, when it judges implementation and tests together in one matrix. With layer
plugins, `/use-case-coverage UC-001` in `aiup-core` runs the same audit with the markers of `docs/architecture/development.md`.

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
