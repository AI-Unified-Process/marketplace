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
| Client      | Calls to external systems: outbound port, adapter, mapping of the provider's contract | –          |
| Service     | Business logic: transactions, business rules, orchestration                  | Persistence, Client |
| API         | Remote contract for a separate client: endpoints, DTOs, error format         | Service             |
| UI          | Views, forms, grids, navigation                                              | Service (or API)¹   |
| E2E         | Browser tests of a use case or a test case journey                           | UI                  |

A server-side UI (Vaadin Flow) and a Hilla UI call the service layer directly. Hilla's `@BrowserCallable` endpoint
is part of the Hilla UI skill, not of a separate API layer. A client-side UI (Angular) always needs an API layer and
reaches the service through it. An API layer next to a server-side or Hilla UI is valid: it serves other clients —
a mobile app, a partner system — and not the UI. A REST service without a UI has no UI and no E2E layer; its API
tests are the outermost tests.

The **Client** layer is the outbound counterpart of Persistence: our system calls another system there, as the use
case's Secondary Actors line says (a payment provider, a channel manager). It is not the "client" of the API row — a
separate application that calls *us* — and never an entry layer. A project that calls no external system marks it
`–`; which systems it calls is the section "External systems" below.

¹ **A Vaadin Flow UI may sit on the persistence layer.** A project can decide against a service layer — a thin
`ui` + `domain` design, usually recorded in an ADR: the Service row is `–`, the view calls the repositories, the
repository is the transaction boundary, and the view and its form enforce the business rules, with the query
condition or database constraint below where one fits. This holds only while the Flow UI is the single entry
point: an API layer needs the service layer, because both entry layers would have to enforce the same rules, and a
Hilla UI needs it, because its `@BrowserCallable` endpoint is a remote API the browser calls.

## Entry layers of a use case

API, UI, and — for a use case no actor reaches through either, such as a scheduled job — Service are the **entry
layers**: where an actor reaches the system. A use case's optional `**Layers:**` line names the entry layers that
offer it (`UI`, `API`, both, or `Service` alone); without the line, every entry layer of the project offers it.
The line narrows only the entry layers: migration, persistence, and service run for every use case, with or
without it (a layer with nothing to do for the use case says so), and E2E follows the UI.

**A client-side UI that reaches the service through the API (Angular) implies its API layer.** A use case offered
through `UI` is built in the API layer too, tested there (the UI row of the Integration layer table names the API), and its
endpoints are part of the use case, not drift — whether or not the `**Layers:**` line also names `API`.

## External systems

The Client layer has one technology and one skill, which serves every external system of the project. Which systems
those are, and the contract each one is called by, `/stack` records in the `## External systems` table of the stack
file:

```markdown
| System           | Contract                                          | Location                                     |
|------------------|---------------------------------------------------|----------------------------------------------|
| Payment Provider | `docs/api/external/payment-provider.yaml`         | `com.example.hotel.client.paymentprovider`   |
| Channel Manager  | `docs/api/external/channel-manager.asyncapi.yaml` | `hotel-channel-client`                       |
```

- **System** is the name the use cases write on their `**Secondary Actors:**` line. A secondary actor that matches
  a row is an external system our system calls; every other one is a person or a role.
- **Contract** is the provider's OpenAPI document (HTTP) or AsyncAPI document (messaging), usually supplied by the
  provider; `–` while there is none, and the client skill then builds nothing for the system.
- **Location** is the package or module of the adapter.

A use case runs the Client layer only when one of its secondary actors matches a row. A step that calls a secondary
actor no row lists is a gap in the architecture, not the specification: `/use-case-implement` stops and hands off to
`/stack`. A system that calls us is a primary actor and reaches the system through an entry layer, never through
Client.

## Tests run, and the integration layer

Each layer skill's `references/layer.md` says what its test skill exercises: *in process, real database* means the
tests run the application context inside the JVM against the real database, so every layer below is exercised for
real; *backend mocked* means the UI test stubs the layer below; *running application* means black-box browser
tests; *in process, external system stubbed* means the client tests call the adapter against a stub of the
provider's contract. Client is never an entry layer, so its value never decides an integration layer. The
integration layer's tests put a fake of the client port in place of the adapter, so no test reaches the external
system (`/use-case-test`, "Which Layer Tests What").

This section is the only place that derives the integration layer. `/stack` applies it once per entry layer
and records the result as the Integration layer table under the Layers table of `docs/architecture/stack.md`;
every other skill and the coverage agent look the layer up in that table and never derive it again.

**The rule.** Start at the entry layer through which a use case is offered. When its test skill runs *in process,
real database*, that layer is the **integration layer**. When it does not — a UI whose tests mock the backend — the
integration layer is the layer that entry layer calls, by the same rule:

| Entry layer | Its tests              | Integration layer                                         |
|-------------|------------------------|-----------------------------------------------------------|
| Vaadin Flow | in process             | UI                                                        |
| Hilla       | backend mocked         | Service — the `@BrowserCallable` endpoint calls it directly |
| Angular     | backend mocked         | API — the UI reaches the service through it               |
| REST API    | in process             | API                                                       |
| Service     | in process             | Service (Persistence when the project has no service layer) |

Because the rule starts at the entry point, an API next to a Vaadin Flow or Hilla UI never moves the UI's
integration layer: the UI does not call it. It is the integration layer only of the use cases offered through it
alone. A layer built without a layer skill (Skill column `–`) has no `layer.md`: count a server-side technology
(Spring MVC, a JVM UI framework) as *in process, real database*, and ask about any other. E2E is never an entry
layer and never the integration layer.

**Recorded per entry layer.** The Integration layer table has one row per entry layer of the project, in the order
UI, API, Service — the service row always, because a use case can be offered through the service alone. A use case
is tested in the first row its `**Layers:**` line names; a use case without the line, in the first row:

```markdown
**Integration layer:**

| Use case offered through | Tested in | Test skill            |
|--------------------------|-----------|-----------------------|
| UI                       | UI        | `vaadin-flow-ui-test` |
| API                      | API       | `spring-rest-test`    |
| Service                  | Service   | `spring-service-test` |
```

`/use-case-test` runs the test skills from that layer upwards and writes no tests of their own for the layers below;
what each layer tests is in `/use-case-test`, "Which Layer Tests What".

## E2E scope

Browser tests are the slow and expensive layer, and a team decides how many it wants. With an E2E layer, the
stack file records the decision on one line under the Integration layer table:

| `**E2E scope:**`           | `/use-case-test` (UC-*)                                                  | `/test-case-implement` (TC-*) |
|----------------------------|--------------------------------------------------------------------------|-------------------------------|
| `Use cases and test cases` | an E2E test per use case offered through the UI, after the integration layer | the journey                   |
| `Test cases only`          | no E2E test; the integration layer tests the use case alone              | the journey                   |

A stack file without the line counts as `Use cases and test cases`, the behaviour before the line existed.
A project without an E2E layer has no line. Only `/stack` writes it; `/use-case-test`, the E2E test skills,
and the coverage agent read it.

## Plugins

The layer plugins of this marketplace. `/stack` discovers the installed skills from their own
`references/layer.md` (where to look is in its section "The layer skills") and uses this list only to name a plugin
to install. A layer
plugin outside this marketplace needs no row here. `scripts/check-layer-catalog.sh` checks that this table and the
`layer.md` files of the plugins agree.

| Plugin             | Layer       | Skill              | Test skill                 | Tests run                   |
|--------------------|-------------|--------------------|----------------------------|-----------------------------|
| `aiup-flyway`      | Migration   | `flyway-schema`    | –                          | –                           |
| `aiup-jooq`        | Persistence | `jooq-persistence` | `jooq-persistence-test`    | in process, real database   |
| `aiup-jpa`         | Persistence | `jpa-persistence`  | `jpa-persistence-test`     | in process, real database   |
| `aiup-spring-boot` | Client      | `spring-client`    | `spring-client-test`       | in process, external system stubbed |
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
| Vaadin Flow and a REST API, jOOQ | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    | UI (API for `API`-only use cases) |
| Hilla, jOOQ                     | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    | Service           |
| Hilla and a REST API, jOOQ      | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    | Service (API for `API`-only use cases) |
| Angular, Spring Boot, JPA       | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`, `aiup-angular`, `aiup-playwright` | API               |

The combined stack plugins (`aiup-vaadin-jooq`, `aiup-angular-jpa`, `aiup-blazor-dotnet`, `aiup-nestjs-nextjs`) do not
use this catalog; they ship their own `/implement`.
