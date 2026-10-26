<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Moving from a combined stack plugin to layer plugins

`aiup-vaadin-jooq` and `aiup-angular-jpa` are deprecated and will be removed with `aiup-core` 4.0.0. A project that
uses one of them keeps its code, its
tests, and everything under `docs/`; what changes is which plugins are installed, which commands run, and where the
`UseCase` annotation lives. This guide walks through the change. `aiup-blazor-dotnet` stays combined: its
Vertical Slice Architecture keeps a use case's handler and data access in one slice, which layer plugins would split
apart. `aiup-nestjs-nextjs` stays combined until its layers are split out. Nothing here applies to either.

Read [Workflow and artifacts](workflow.md#workflow) for how the two forms differ, and the
[layer catalog](../aiup-core/skills/stack/references/layer-catalog.md) for the layers and the plugins of each.

## What changes, what stays

| Stays                                                                  | Changes                                                                                                |
|------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| Every file under `docs/`: requirements, entity model, use cases, tests | `docs/architecture/stack.md` is added, written by `/stack`                                             |
| The code and the tests the combined plugin wrote                       | The plugins: one combined plugin becomes one plugin per layer                                          |
| `// UC-XXX BR-YYY:` markers above the code that enforces a rule        | The commands: `/implement` becomes `/use-case-implement`, the test skills run through `/use-case-test` |
| `@UseCase` on every test method, test class names, Playwright tests    | The `UseCase` annotation moves from `src/main/java` to `src/test/java`                                 |
| Existing test data in `db/testdata/` (kept as the project's convention) | Tests are written once, in the integration layer, not once per layer                                   |

## 1. Replace the plugins

Remove the combined plugin and install `aiup-core` 3.0.0 or later with one plugin per layer of the project. Never
keep both forms in one project: the combined plugin does not read `docs/architecture/stack.md`, and its `/implement` and
the layer skills would build the same use case twice.

| Combined plugin    | Layer plugins                                                                    | Integration layer                     |
|--------------------|----------------------------------------------------------------------------------|---------------------------------------|
| `aiup-vaadin-jooq` | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    | UI with Vaadin Flow, Service with Hilla |
| `aiup-angular-jpa` | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`, `aiup-angular`, `aiup-playwright` | API                                   |

Claude Code:

```text
/plugin uninstall aiup-vaadin-jooq
/plugin install aiup-core
/plugin install aiup-flyway
/plugin install aiup-jooq
/plugin install aiup-spring-boot
/plugin install aiup-vaadin
```

Tessl: remove the combined package from the project and install the layer packages, for example
`tessl install ai-unified-process/aiup-flyway`. Tessl does not install dependencies: install `aiup-core` and, with
`aiup-jooq`, `aiup-jpa`, or `aiup-vaadin`, also `aiup-spring-boot` explicitly. See the
[Tessl guide](installation/tessl.md); for other agents see
[Agent Plugins and manual setup](installation/other-agents.md).

## 2. Record the architecture

```text
/stack
```

The skill detects Flyway, jOOQ or JPA, Spring Boot, and Vaadin or Angular from the build files and the source tree,
asks only where two technologies fit, and writes the stack file: the Layers table with the skill and the test
skill of each layer, the Integration layer table, the module layout, the API contract when there is one, and
the build and test commands, in `docs/architecture/stack.md`. Architecture documentation the project already
has — a `docs/architecture.md`, arc42, C4 — is read as input and left where it is. Nothing in the code changes.

The Markers table starts with the `All` row only. Each layer skill adds its own rows the first time it runs, so the
first `/use-case-coverage` after the switch audits with the code marker and the domain vocabulary alone and says so; the
second one is precise.

## 3. Move the `UseCase` annotation to the test sources

The combined plugins created the annotation in `src/main/java/<root package>/usecase/UseCase.java`. The layer test
skills search the **test** sources of the module under test for `@interface UseCase`, reuse it when it is there, and
otherwise create it in `src/test/java/<root package>/usecase/UseCase.java`. An annotation left in `src/main/java`
means a second copy in `src/test/java` on the next test run, with the same short name.

Move the file before the first `/use-case-test`:

```text
src/main/java/com/example/app/usecase/UseCase.java  →  src/test/java/com/example/app/usecase/UseCase.java
```

Keep the package, so no test import changes. In a hexagonal multi-module project, every module that holds use case
tests gets its own copy in its own `src/test/java`; the Navigator plugin resolves the annotation by its short name.

## 4. Use the new commands

| Combined plugin command | Layer plugins                                                                                                                                                                                                                                            |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/flyway-migration`     | `/flyway-schema`, run by `/use-case-implement` as the first layer                                                                                                                                                                                        |
| `/implement`            | `/use-case-implement UC-XXX`: migration, persistence, service, API, UI, each layer by its own skill with a Handover to the next                                                                                                                          |
| `/implement-hilla`      | `/use-case-implement UC-XXX` with `hilla-ui` in the UI row of `docs/architecture/stack.md`                                                                                                                                                               |
| `/browserless-test`     | `/vaadin-flow-ui-test`, the integration layer of a Vaadin Flow project, run by `/use-case-test UC-XXX`                                                                                                                                                   |
| `/karibu-test`          | Not carried over. Browserless Testing supersedes Karibu; existing Karibu tests keep running and are left alone                                                                                                                                           |
| `/hilla-test`           | `/hilla-ui-test` for the views, `/spring-service-test` for the service behind them, both run by `/use-case-test UC-XXX`                                                                                                                                  |
| `/spring-boot-test`     | `/spring-rest-test`, the integration layer behind an Angular client, run by `/use-case-test UC-XXX`; `/spring-service-test` and `/jpa-persistence-test` only when a run names them (`/use-case-test UC-XXX service`) or a unit is out of the API's reach |
| `/vitest-test`          | `/angular-ui-test`, run by `/use-case-test UC-XXX`                                                                                                                                                                                                       |
| `/playwright-test`      | `/vaadin-e2e-test` or `/playwright-e2e-test`, run by `/use-case-test UC-XXX` as the last layer and by `/test-case-implement TC-XXX` alone                                                                                                                |
| `/coverage-check`       | `/use-case-coverage UC-XXX`, `/test-case-coverage TC-XXX`                                                                                                                                                                                                |

The orchestrators are named `use-case-<step>` and `test-case-<step>`, next to `/use-case-spec` and `/test-case`, and
the layer skills `<technology>-<layer>[-test]`, so old and new plugins never collide in an agent host or on Tessl.
The names are final: they stay when the combined plugins are removed.

## 5. The first construction round on existing code

Pick a use case the combined plugin implemented and run the round once to see the layer skills reconcile what is
there:

1. **`/use-case-implement UC-XXX`** finds the existing views, services, repositories, and DTOs by the names the
   specification implies and by their `UC-XXX` references, and changes only what the current specification requires.
   It does not distinguish code the combined plugin wrote from its own. The service layer, which the old `/implement`
   built as part of the slice, is now owned by `/spring-service` and reconciled by it.
2. **`/use-case-test UC-XXX`** runs the test skills from the integration layer up. Existing test classes are reconciled, not
   renamed and not duplicated. Check the report of this first run: it must name the existing class it updated, not a
   second one. The class names the combined plugins used and the layer test skills write are the same for the Vaadin
   stack (`UC<id><Name>Test`, `UC<id><Name>ServiceTest` behind Hilla, `UC<id><Name>IT`); on the Angular stack the old
   `/spring-boot-test` classes are named `UC<id><Name>Test`, while new API tests are `UC<id><Name>ApiTest`.
3. **`/use-case-coverage UC-XXX`** audits the result and suggests the next `**Status:**` value. Service and repository tests
   the combined plugin wrote are not gaps; they are reconciled when their layer runs and otherwise left in place.

Tests the combined plugin wrote below the new integration layer stay valid. `/use-case-test` runs their layer only to
reconcile them when the specification changes; it writes no new tests there unless a run names the layer.

## Coming from aiup-core 3.0.0

`aiup-core` 3.0.0 recorded the layers in `docs/architecture/development.md`, the Development View of a 4+1 folder,
written by `/architecture`. Since 3.1.0 the skill is `/stack`, the stack file is `docs/architecture/stack.md`, and
no construction skill reads `development.md` any more. Run `/stack` once after the update: it renames
`development.md` to `stack.md`, keeps its tables and the text the team wrote into it, changes the links to the old
path, and asks no layer question the file already answers. The `docs/architecture/README.md` index 3.0.0 wrote stays
as the team's document.

## What the layer plugins add

- A REST API without a UI, or any other combination from the catalog, which a combined plugin could not express.
- One `docs/architecture/stack.md` per project instead of a stack hard-wired into the plugin.
- The shared rules once, in `/use-case-implement` and `/use-case-test`, instead of a copy in every plugin.
- A use case tested once, in the integration layer, with every business rule's allowed and rejected case, instead of
  once per layer.
- `/use-case-coverage` for every combination, reading the markers the layer skills record in the project.
