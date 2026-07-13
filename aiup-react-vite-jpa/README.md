# aiup-react-vite-jpa

> The React + Vite + JPA stack plugin for the [**AI Unified Process (AIUP)**](https://unifiedprocess.ai) — turns use
> case specifications into an implemented, tested Spring Boot API and React frontend.

`aiup-react-vite-jpa` is the **technology-specific** layer of the AI Unified Process for applications with a
[Spring Boot](https://spring.io/projects/spring-boot) + [JPA/Hibernate](https://hibernate.org) backend and a
[React](https://react.dev) + [Vite](https://vite.dev) frontend. It takes the artifacts produced by
[`aiup/aiup-core`](https://registry.tessl.io/aiup/aiup-core) — the entity model and use case specifications — and
turns them into database migrations, a REST API, a React UI, and a full test suite across both halves of the stack.

Unlike a server-rendered UI framework, this is a **split client/server architecture**: the backend and frontend are
independent builds that only share a JSON contract over HTTP. Every skill in this plugin reflects that split.

## What it does

This plugin covers the **Construction** phase of the AI Unified Process for the React/Vite/JPA stack: schema
migrations, backend and frontend implementation, and testing on both sides — with every artifact traceable back to a
use case (`UC-*`).

It is meant to be used **together with `aiup/aiup-core`**, which produces the upstream `docs/entity_model.md` and
`docs/use_cases/UC-*.md` artifacts these skills read.

## Skills

Each skill is also available as a slash command.

| Phase        | Skill / command     | Description                                                                     |
|--------------|---------------------|---------------------------------------------------------------------------------|
| Construction | `/flyway-migration` | Create versioned Flyway migration scripts (`V*.sql`) from the entity model      |
| Construction | `/implement`        | Implement use cases as a Spring Data JPA + REST backend and a React frontend    |
| Construction | `/spring-boot-test` | Create Spring Boot integration tests for controllers and JPA repositories       |
| Construction | `/vitest-test`      | Create Vitest + React Testing Library component tests (recommended, no browser) |
| Construction | `/playwright-test`  | Create Playwright browser-based end-to-end tests                                |

### Workflow

```
Construction
──────────────────────────────────────────────────────
/flyway-migration  →  /implement  →  /spring-boot-test
                                  ↘  /vitest-test
                                  ↘  /playwright-test
```

These skills read the AIUP artifacts under `docs/` (`docs/entity_model.md`, `docs/use_cases/UC-*.md`) produced by
`aiup/aiup-core` and write code and tests into your backend (Maven/Gradle) and frontend (npm/Vite) projects.

## MCP servers

| Server     | Purpose                                                            |
|------------|--------------------------------------------------------------------|
| JavaDocs   | Javadoc lookup for Spring/Hibernate/JUnit/AssertJ on the classpath |
| Playwright | Browser automation for end-to-end tests                            |

React, Vite, TanStack Query, Vitest, React Testing Library, and MSW docs are already covered by `aiup-core`'s
**context7** MCP server — no separate frontend doc server is needed here. See
[`rules/mcp-servers.md`](rules/mcp-servers.md) for setup details.

## Installation

Install from the Tessl registry (install the core plugin too, if you haven't already):

```
tessl install aiup/aiup-core
tessl install aiup/aiup-react-vite-jpa
```

## Prerequisites

- [`aiup/aiup-core`](https://registry.tessl.io/aiup/aiup-core) installed, with use case specifications and an entity
  model already produced under `docs/`
- A Maven or Gradle backend project with Spring Boot, Spring Data JPA, and Flyway on the classpath
- A Vite + React (TypeScript) frontend project
- Optional MCP servers (JavaDocs, Playwright) configured per [`rules/mcp-servers.md`](rules/mcp-servers.md)

## Project Structure

After running the full workflow for a project, your tree will look like this:

```
your-project/
├── docs/
│   ├── vision.md
│   ├── requirements.md
│   ├── entity_model.md
│   ├── use_cases.puml
│   └── use_cases/
│       └── UC-001-*.md
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/                     ← produced by /implement (entity, repository, service, controller)
│   │   │   └── resources/
│   │   │       └── db/migration/         ← produced by /flyway-migration
│   │   └── test/
│   │       ├── java/                     ← produced by /spring-boot-test
│   │       └── resources/db/migration/   ← test data seeds
│   └── pom.xml
└── frontend/
    ├── src/                              ← produced by /implement (pages, components, API client)
    ├── tests/e2e/                        ← produced by /playwright-test
    └── package.json
```

## License

Apache-2.0 · © [Simon Martinelli](https://unifiedprocess.ai)
