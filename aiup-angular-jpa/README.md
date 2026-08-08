# aiup-angular-jpa

> The Angular + JPA stack plugin for the [**AI Unified Process (AIUP)**](https://unifiedprocess.ai) — turns use
> case specifications into an implemented, tested Spring Boot API and Angular frontend.

`aiup-angular-jpa` is the **technology-specific** layer of the AI Unified Process for applications with a
[Spring Boot](https://spring.io/projects/spring-boot) + [JPA/Hibernate](https://hibernate.org) backend and an
[Angular](https://angular.dev) frontend. It takes the artifacts produced by
[`aiup/aiup-core`](https://registry.tessl.io/aiup/aiup-core) — the entity model and use case specifications — and
turns them into database migrations, a REST API, an Angular UI, and a full test suite across both halves of the
stack.

Unlike a server-rendered UI framework, this is a **split client/server architecture**: the backend and frontend are
independent builds that only share a JSON contract over HTTP. Every skill in this plugin reflects that split.

## What makes this plugin different from `aiup-vaadin-jooq`
Besides the obvious frontend swap, this plugin's backend skills (`/implement`, `/flyway-migration`,
`/spring-boot-test`) **detect and support two backend shapes**, rather than assuming one:

- **Flat single-module** — one Spring Boot project with `@Entity`/repository/service/controller together.
- **Hexagonal multi-module** — a Maven reactor with separate `domain` / `business` / persistence-adapter /
  inbound-adapter / composition-root modules (ports and adapters enforced at the module boundary, not just by
  package naming). This is a common, deliberate architectural choice for larger Spring Boot backends, and the
  skills detect it and follow its existing conventions (including asymmetric ones — e.g. an outbound-only port,
  no inbound use-case interface) rather than forcing every project into one shape.

See [`skills/implement/references/module-layout.md`](skills/implement/references/module-layout.md) for the
detection heuristic shared by all three skills.

## What it does

This plugin covers the **Construction** phase of the AI Unified Process for the Angular/JPA stack: schema
migrations, backend and frontend implementation, and testing on both sides — with every artifact traceable back to
a use case (`UC-*`).

It is meant to be used **together with `aiup/aiup-core`**, which produces the upstream `docs/entity_model.md` and
`docs/use_cases/UC-*.md` artifacts these skills read. It is **not meant to be used together with `aiup/aiup-vaadin-jooq**,

## Skills

Each skill is also available as a slash command.

| Phase        | Skill / command     | Description                                                                                |
|--------------|---------------------|--------------------------------------------------------------------------------------------|
| Construction | `/flyway-migration` | Create versioned Flyway migration scripts (`V*.sql`) from the entity model                 |
| Construction | `/implement`        | Implement use cases across a flat or hexagonal Spring Boot backend and an Angular frontend |
| Construction | `/spring-boot-test` | Create Spring Boot tests (RestAssured+Testcontainers or MockMvc, auto-detected)            |
| Construction | `/vitest-test`      | Create Vitest component tests using Angular's own TestBed/HttpTestingController idioms     |
| Construction | `/playwright-test`  | Create Playwright browser-based end-to-end tests                                           |

### Workflow

```
Construction
──────────────────────────────────────────────────────
/flyway-migration  →  /implement  →  /spring-boot-test
                                  ↘  /vitest-test
                                  ↘  /playwright-test
```

These skills read the AI Unified Process artifacts under `docs/` (`docs/entity_model.md`, `docs/use_cases/UC-*.md`) produced by
`aiup/aiup-core` and write code and tests into your backend (Maven/Gradle, flat or multi-module) and frontend
(npm/Angular CLI) projects.

## MCP servers

| Server      | Purpose                                                                                  |
|-------------|------------------------------------------------------------------------------------------|
| JavaDocs    | Javadoc lookup for Spring/Hibernate/RestAssured/Testcontainers on the classpath          |
| Playwright  | Browser automation for end-to-end tests                                                  |

RxJS and Vitest docs are covered by `aiup-core`'s **context7**
MCP server. See [`rules/mcp-servers.md`](rules/mcp-servers.md) for setup details.

## Installation

Install from the Tessl registry (install the core plugin too, if you haven't already):

```
tessl install aiup/aiup-core
tessl install aiup/aiup-angular-jpa
```

## Prerequisites

- [`aiup/aiup-core`](https://registry.tessl.io/aiup/aiup-core) installed, with use case specifications and an
  entity model already produced under `docs/`
- A Maven or Gradle backend project with Spring Boot, Spring Data JPA, and Flyway — either a flat single module,
  or a hexagonal `domain`/`business`/persistence-adapter/inbound-adapter/composition-root-style multi-module
  layout
- An Angular (standalone components) frontend project
- Optional MCP servers (JavaDocs, Playwright) configured per [`rules/mcp-servers.md`](rules/mcp-servers.md)

## Project Structure

### Flat single-module backend

```
your-project/
├── docs/
│   └── ...
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/                     ← produced by /implement (entity, repository, service, controller)
│   │   │   └── resources/
│   │   │       └── db/migration/         ← produced by /flyway-migration
│   │   └── test/
│   │       ├── java/                     ← produced by /spring-boot-test
│   │       └── resources/db/migration/   ← test data seeds (MockMvc convention only)
│   └── pom.xml
└── frontend/
    ├── src/app/                           ← produced by /implement (pages, components, services)
    ├── tests/e2e/                         ← produced by /playwright-test
    └── package.json
```

### Hexagonal multi-module backend

```
your-project/
├── docs/
│   └── ...
├── backend/
│   ├── pom.xml                           ← reactor
│   ├── xxx-domain/                       ← pure domain records, zero framework deps
│   ├── xxx-business/                     ← services, outbound port interfaces, DTOs
│   ├── xxx-postgres/                     ← JPA entities, converters, Spring Data repos
│   │   └── src/main/resources/db/migration/  ← produced by /flyway-migration
│   ├── xxx-api/                          ← REST controllers
│   └── xxx-app/                          ← composition root
│       └── src/test/java/                ← produced by /spring-boot-test (only module with tests)
└── frontend/
    ├── src/app/                           ← produced by /implement (pages, components, services)
    ├── tests/e2e/                         ← produced by /playwright-test
    └── package.json
```

## License

Apache-2.0 · © [Marc Affolter](https://unifiedprocess.ai)
