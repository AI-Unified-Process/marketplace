<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-spring-boot

`aiup-spring-boot` is the AI Unified Process layer plugin for the **service**, **API**, and **client** layers of a
[Spring Boot](https://spring.io/projects/spring-boot) application: the business logic with its transactions and
business rules, a REST API with RFC 9457 Problem Details, and the calls to the external systems a use case names as
secondary actors — each with its test skill.

It is one layer of a stack, not a stack. Combine it with `aiup-core` (3.9.0 or later) and one plugin per other layer
of your project. `/stack` records which plugin builds which layer in `docs/architecture/stack.md`; `/use-case-implement`,
`/use-case-test`, and `/use-case-coverage` run the layer skills from there.

## Skills

| Layer   | Skill                                                           | Result                                                                                      |
|---------|-----------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| Client  | [`/spring-client`](skills/spring-client/SKILL.md)               | Outbound port and adapter per external system, from its OpenAPI or AsyncAPI contract: `RestClient`/`@HttpExchange` or a Kafka/AMQP producer, error mapping to domain exceptions |
| Service | [`/spring-service`](skills/spring-service/SKILL.md)             | `@Service` methods, `@Transactional` boundaries, business rules with markers, domain exceptions, Bean Validation |
| API     | [`/spring-rest`](skills/spring-rest/SKILL.md)                   | `@RestController` endpoints, request/response DTO records, Problem Details, status codes, paging; an agreed OpenAPI operation built as written |
| Client  | [`/spring-client-test`](skills/spring-client-test/SKILL.md)     | `<System>ClientTest`: the adapter against a stub of the contract, every flow the system causes; `<System>ClientFake` for the tests above |
| Service | [`/spring-service-test`](skills/spring-service-test/SKILL.md)   | `UC001<Name>ServiceTest`: every business rule allowed and rejected, against a real database or a fake port |
| API     | [`/spring-rest-test`](skills/spring-rest-test/SKILL.md)         | `UC001<Name>ApiTest`: statuses, JSON contract, Problem Details bodies, through the full stack |

Each skill is normally run by `/use-case-implement UC-XXX` or `/use-case-test UC-XXX`, which pass the **Handover** of the layer
below — the repository methods, the service methods and exceptions, the endpoints — to the next. Each can also be
run directly, for example `/spring-rest UC-001` to change only the API of a use case.

The service layer is used by every UI: a Vaadin Flow view calls it directly, a Hilla `@BrowserCallable` endpoint
(built by `/hilla-ui` in `aiup-vaadin`) delegates to it, and `/spring-rest` exposes it to a client-side UI such as
Angular. The service never depends on a web or UI type.

An external system the use case calls — a payment provider, a channel manager — is listed with its contract under
`## External systems` in `docs/architecture/stack.md`. `/spring-client` runs only for a use case whose Secondary
Actors line names such a system, before the service, and hands over the port the service calls. No test reaches the
system: `/spring-client-test` stubs the contract and writes a fake of the port, which the service, API, and UI tests
put in place of the adapter.

The other direction — an external system that calls us — is the use case's primary actor and reaches it through
the API layer. When its team has agreed an OpenAPI contract with yours, the use case links the operation on its
`**API:**` line (`[registerGuest](../api/booking-portal.yaml#registerGuest)`). In a contract-first project
`/spring-rest` builds that operation exactly as written — path, property names, statuses, error responses — instead
of choosing them, and `/spring-rest-test` takes its expected values from it. Where contract and specification
disagree, neither skill decides: the gap goes to `docs/open_questions.md`.

## Combinations

| Project                       | Plugins next to `aiup-core`                                                      |
|-------------------------------|----------------------------------------------------------------------------------|
| REST API, Spring Boot, jOOQ   | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`                                   |
| REST API, Spring Boot, JPA    | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`                                    |
| Vaadin Flow, jOOQ             | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    |
| Hilla, jOOQ                   | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin`                    |
| Angular, Spring Boot, JPA     | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`, `aiup-angular`, `aiup-playwright` |

A use case is tested once, in the integration layer of the entry layer it is offered through, which `/stack`
records in the Integration layer table of `docs/architecture/stack.md`:

| Project                            | Integration layer | What this plugin's test skills write                                                |
|------------------------------------|-------------------|-------------------------------------------------------------------------------------|
| REST API only, or Angular          | API               | `/spring-rest-test`: every business rule; `/spring-service-test` nothing new        |
| Vaadin Flow (with or without REST) | UI                | `/spring-rest-test`: the endpoint contract only; `/spring-service-test` nothing new |
| Hilla (with or without REST)       | Service           | `/spring-service-test`: every business rule; `/spring-rest-test`: the contract only |
| No entry layer                     | Service           | `/spring-service-test`: every business rule                                         |

A REST API next to a Vaadin Flow or Hilla UI serves other clients; the UI does not call it, so it is the integration
layer only of the use cases offered through the API alone. Below the integration layer, `/spring-service-test` only reconciles existing tests and covers
units the integration layer's skill reports it cannot reach. In a Vaadin or Hilla application without a public API,
the API layer is marked `–` in `docs/architecture/stack.md` and `/spring-rest` does not run.

Do not install this plugin together with a combined stack plugin (`aiup-vaadin-jooq`, `aiup-angular-jpa`) in one
project.

## Architecture support

The skills follow the module layout recorded in `docs/architecture/stack.md`:

- **Flat single module:** repositories, services, and controllers in one Spring Boot module.
- **Hexagonal multi-module:** domain, business, persistence adapter, inbound adapter, and composition-root modules,
  with the outbound port in the business module.

Existing conventions are preserved rather than rewritten into a textbook architecture. The detection rules, used
when `docs/architecture/stack.md` does not record the layout, are in
[`skills/spring-service/references/module-layout.md`](skills/spring-service/references/module-layout.md).

## Traceability

| Kind | Marker                                                                                    |
|------|-------------------------------------------------------------------------------------------|
| Code | `// UC-XXX BR-YYY: <rule>` above the service guard clause that enforces a business rule    |
| Code | `UC-XXX` in the Javadoc of the service method and the controller method that realize a step |
| Test | `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {…}, requirements = {…})` on every test method |
| Name | `UC<id><Name>ServiceTest`, `UC<id><Name>ApiTest` / `ApiIT`                                 |

Every skill writes its rows into the Markers table of `docs/architecture/stack.md`, which `/use-case-coverage` reads.

## Installation

### Tessl

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-spring-boot
```

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-spring-boot
```

Install the plugins of the other layers (migration, persistence, UI) the same way. See the marketplace
[installation guides](../docs/installation/) for other agents and manual adoption.

## MCP servers

The plugin configures the optional [JavaDocs](https://www.javadocs.dev) MCP server for Spring API lookups; see
[`rules/mcp-servers.md`](rules/mcp-servers.md). The skills work without it.

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
