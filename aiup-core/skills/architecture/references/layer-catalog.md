<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Layer catalog

The technical layers a project combines, the rules that hold them together, and the layer plugins of the AI Unified
Process marketplace. A project combines one plugin per layer with `aiup-core`.

## Layers

| Layer       | Builds                                                                       | Depends on          |
|-------------|------------------------------------------------------------------------------|---------------------|
| Migration   | Versioned schema changes from the entity model                               | –                   |
| Persistence | Data access: queries, repositories, entity mapping, projections into records | Migration           |
| Service     | Business logic: transactions, business rules, orchestration                  | Persistence         |
| API         | Remote contract for a separate client: endpoints, DTOs, error format         | Service             |
| UI          | Views, forms, grids, navigation                                              | Service (or API)    |
| E2E         | Browser tests of a use case or a test case journey                           | UI                  |

A server-side UI (Vaadin Flow) and a Hilla UI call the service layer directly. Hilla's `@BrowserCallable` endpoint
is part of the Hilla UI skill, not of a separate API layer. A client-side UI (Angular) always needs an API layer and
reaches the service through it. An API layer next to a server-side or Hilla UI is valid: it serves other clients —
a mobile app, a partner system — and not the UI. A REST service without a UI has no UI and no E2E layer; its API
tests are the outermost tests.

## Entry layers of a use case

API, UI, and — for a use case no actor reaches through either, such as a scheduled job — Service are the **entry
layers**: where an actor reaches the system. A use case's optional `**Layers:**` line names the entry layers that
offer it (`UI`, `API`, both, or `Service` alone); without the line, every entry layer of the project offers it.
The line narrows only the entry layers: migration, persistence, and service run for every use case, with or
without it (a layer with nothing to do for the use case says so), and E2E follows the UI.

**A client-side UI that reaches the service through the API (Angular) implies its API layer.** A use case offered
through `UI` is built in the API layer too, tested there (the API is that project's integration layer), and its
endpoints are part of the use case, not drift — whether or not the `**Layers:**` line also names `API`.

## Tests run, and the integration layer

Each layer skill's `references/layer.md` says what its test skill exercises: *in process, real database* means the
tests run the application context inside the JVM against the real database, so every layer below is exercised for
real; *backend mocked* means the UI test stubs the layer below; *running application* means black-box browser
tests.

This section is the only place that derives the integration layer. `/architecture` applies it once and records the
result as the `**Integration layer:**` line under the Layers table of `docs/architecture/development.md`; every
other skill and the coverage agent read that line and never derive it again.

**The rule.** The project's **integration layer** is the topmost layer of its Layers table, in the bottom-up order
migration → persistence → service → API → UI, whose test skill runs *in process, real database* — except an API
layer next to a UI that does not call it (Vaadin Flow; Hilla, whose `@BrowserCallable` endpoint belongs to the UI
layer). Such an API serves other clients, never counts as the integration layer, and tests only its own contract.

**The rule as a lookup.** Apply the table; derive with the rule only for a combination it does not list (a team's
own layer skill):

| Entry layers of the project | Integration layer      |
|-----------------------------|------------------------|
| Vaadin Flow (± REST API)    | UI                     |
| Hilla (± REST API)          | Service                |
| Angular + REST API          | API                    |
| REST API, no UI             | API                    |
| none                        | Service (or Persistence when there is no service layer) |

A layer built without a layer skill (Skill column `–`) has no `layer.md`: count a server-side technology (Spring
MVC, a JVM UI framework) as *in process, real database*, and ask about any other. E2E is never the integration
layer.

**A use case's own integration layer.** The project's line applies to a use case without a `**Layers:**` line and
to one whose line names `UI`. A use case whose line leaves out `UI` is tested in the API layer when the line names
`API`, and in the service layer when it names `Service` alone — so an `API`-only use case is tested in the API
layer next to a Vaadin Flow or a Hilla UI as well.

`/use-case-test` runs the test skills from that layer upwards and writes no tests of their own for the layers below;
what each layer tests is in `/use-case-test`, "Which Layer Tests What".

## Plugins

The layer plugins of this marketplace. `/architecture` discovers the installed skills from their own
`references/layer.md` (where to look is in its section "The layer skills") and uses this list only to name a plugin
to install. A layer
plugin outside this marketplace needs no row here. `scripts/check-layer-catalog.sh` checks that this table and the
`layer.md` files of the plugins agree.

| Plugin             | Layer       | Skill              | Test skill                 | Tests run                   |
|--------------------|-------------|--------------------|----------------------------|-----------------------------|
| `aiup-flyway`      | Migration   | `flyway-schema`    | –                          | –                           |
| `aiup-jooq`        | Persistence | `jooq-persistence` | `jooq-persistence-test`    | in process, real database   |
| `aiup-jpa`         | Persistence | `jpa-persistence`  | `jpa-persistence-test`     | in process, real database   |
| `aiup-spring-boot` | Service     | `spring-service`   | `spring-service-test`      | in process, real database   |
| `aiup-spring-boot` | API         | `spring-rest`      | `spring-rest-test`         | in process, real database   |
| `aiup-vaadin`      | UI          | `vaadin-flow-ui`   | `vaadin-flow-ui-test`      | in process, real database   |
| `aiup-vaadin`      | UI          | `hilla-ui`         | `hilla-ui-test`            | backend mocked              |
| `aiup-vaadin`      | E2E         | –                  | `vaadin-e2e-test`          | running application         |
| `aiup-angular`     | UI          | `angular-ui`       | `angular-ui-test`          | backend mocked              |
| `aiup-playwright`  | E2E         | –                  | `playwright-e2e-test`      | running application         |

`aiup-jooq`, `aiup-jpa`, and `aiup-vaadin` build on Spring Boot and declare `aiup-spring-boot` as a plugin
dependency, so Claude Code installs it with them: its service layer is what their persistence, UI, and tests connect
to, and the persistence skills read the module layout reference of `spring-service`. Tessl has no dependency field; install
`aiup-spring-boot` next to them there. `aiup-flyway`, `aiup-angular`, and `aiup-playwright` need only `aiup-core`.

## Common combinations

| Project                         | Plugins next to `aiup-core`                                                      | Integration layer |
|---------------------------------|----------------------------------------------------------------------------------|-------------------|
| REST API, Spring Boot, jOOQ     | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`                                   | API               |
| REST API, Spring Boot, JPA      | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`                                    | API               |
| Vaadin Flow, jOOQ               | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    | UI                |
| Vaadin Flow and a REST API, jOOQ | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                   | UI (API for `API`-only use cases) |
| Hilla, jOOQ                     | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    | Service           |
| Hilla and a REST API, jOOQ      | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    | Service (API for `API`-only use cases) |
| Angular, Spring Boot, JPA       | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`, `aiup-angular`, `aiup-playwright` | API               |

The combined stack plugins (`aiup-vaadin-jooq`, `aiup-angular-jpa`, `aiup-blazor-dotnet`, `aiup-nestjs-nextjs`) do not
use this catalog; they ship their own `/implement`.
