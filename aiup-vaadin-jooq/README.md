# aiup-vaadin-jooq

> The Vaadin + jOOQ stack plugin for the [**AI Unified Process (AIUP)**](https://unifiedprocess.ai) — turns use case
> specifications into implemented, tested Java code.

`aiup-vaadin-jooq` is the **technology-specific** layer of the AI Unified Process for applications built with
[Vaadin](https://vaadin.com) (UI) and [jOOQ](https://www.jooq.org) (data access). It takes the artifacts produced by
[`aiup/aiup-core`](https://registry.tessl.io/aiup/aiup-core) — the entity model and use case specifications — and turns
them into database migrations, Vaadin views, jOOQ queries, and a full test suite.

## What it does

This plugin covers the **Construction** phase of the AI Unified Process for the Vaadin/jOOQ stack: schema migrations,
implementation, and testing — with every artifact traceable back to a use case (`UC-*`).

It is meant to be used **together with `aiup/aiup-core`**, which produces the upstream `docs/entity_model.md` and
`docs/use_cases/UC-*.md` artifacts these skills read.

## Skills

Each skill is also available as a slash command.

| Phase        | Skill / command       | Description                                                              |
|--------------|-----------------------|--------------------------------------------------------------------------|
| Construction | `/flyway-migration`   | Create versioned Flyway migration scripts (`V*.sql`) from the entity model |
| Construction | `/implement`          | Implement use cases as Vaadin views/forms/grids plus jOOQ data access    |
| Construction | `/browserless-test`   | Create Vaadin Browserless server-side unit tests (recommended)           |
| Construction | `/karibu-test`        | Create Karibu server-side unit tests (legacy — superseded since Vaadin 25.1) |
| Construction | `/playwright-test`    | Create Playwright browser-based integration tests (Drama Finder)         |

### Workflow

```
Construction
────────────────────────────────────────────────────
/flyway-migration  →  /implement  →  /browserless-test
                                  ↘  /playwright-test
```

These skills read the AIUP artifacts under `docs/` (`docs/entity_model.md`, `docs/use_cases/UC-*.md`) produced by
`aiup/aiup-core` and write code and tests into your Maven/Gradle project.

## MCP servers

The plugin wires up MCP servers that give the skills authoritative, version-correct knowledge of the stack. Some are
optional — see [`rules/mcp-servers.md`](rules/mcp-servers.md) for setup details.

| Server         | Purpose                                                          |
|----------------|------------------------------------------------------------------|
| Vaadin         | Vaadin component APIs, docs, and theming (version-aware)         |
| KaribuTesting  | Karibu server-side test generation and migration helpers        |
| jOOQ           | jOOQ query DSL reference, code generation, and SQL examples      |
| JavaDocs       | Javadoc lookup for libraries on the classpath                    |
| Playwright     | Browser automation for end-to-end tests                          |

## Installation

Install from the Tessl registry (install the core plugin too, if you haven't already):

```
tessl install aiup/aiup-core
tessl install aiup/aiup-vaadin-jooq
```

## Prerequisites

- [`aiup/aiup-core`](https://registry.tessl.io/aiup/aiup-core) installed, with use case specifications and an entity
  model already produced under `docs/`
- A Maven or Gradle project with Vaadin and jOOQ on the classpath
- Optional MCP servers (Vaadin, jOOQ, etc.) configured per [`rules/mcp-servers.md`](rules/mcp-servers.md)

## License

Apache-2.0 · © [Simon Martinelli](https://unifiedprocess.ai)
