# aiup-nestjs-nextjs

> The NestJS + Next.js stack plugin for the [**AI Unified Process (AIUP)**](https://unifiedprocess.ai) —
> turns use case specifications into an implemented, tested NestJS API and Next.js frontend.

`aiup-nestjs-nextjs` is the **technology-specific** layer of the AI Unified Process for
applications with a [NestJS](https://nestjs.com) backend using [Drizzle ORM](https://orm.drizzle.team)
over PostgreSQL, and a [Next.js](https://nextjs.org) App Router frontend. It takes the artifacts
produced by [`aiup/aiup-core`](https://registry.tessl.io/aiup/aiup-core) — the entity model, use
case specifications, and test cases — and turns them into schema migrations, a REST API, a
Next.js UI, and a full test suite across both halves of the stack.

Like the Angular/JPA plugin and unlike a server-rendered UI framework, this is a **split
client/server architecture**: the backend and frontend are independent builds that share only a
JSON contract over HTTP. Every skill in this plugin reflects that split.

## What makes this plugin different

This is the marketplace's first **TypeScript-native** stack: both halves run the same language,
the same test runner, and the same package manager. That sounds simpler than the JVM and .NET
plugins, and in most respects it is — but it introduces two failure modes those stacks do not
have, and both are silent:

- **ESM / NodeNext import specifiers.** A NestJS backend on `"type": "module"` with
  `"module": "NodeNext"` requires a `.js` suffix on every relative import *even though the source
  file is `.ts`*. Omit it and nothing compiles; add it in a project that isn't NodeNext and
  nothing compiles either. The skills detect which shape the project is before writing a single
  import.
- **Decorator metadata under Vitest.** NestJS dependency injection reads `design:paramtypes`
  metadata that Vitest's default transformer does not emit. Without `unplugin-swc`, every provider
  fails to resolve with an error that names a parameter index rather than the cause — and on Vite
  8, where Oxc became the default transformer, it silently breaks again even *with*
  `unplugin-swc` installed unless `oxc: false` is also set.

Encoding those two is most of why this plugin exists. The rest is keeping the layers where they
belong: all SQL in repositories, no raw database rows in responses, and relative `/api` paths so
the frontend never hardcodes a backend origin.

## What it does

This plugin covers the **Construction** phase of the AI Unified Process for the NestJS/Next.js
stack: schema migrations, backend and frontend implementation, and testing on both sides — with
every artifact traceable back to a use case (`UC-*`).

It is meant to be used **together with `aiup/aiup-core`**, which produces the upstream
`docs/entity_model.md`, `docs/use_cases/UC-*.md`, and `docs/test_cases/TC-*.md` artifacts these
skills read. Install exactly one stack plugin — this one is **not** meant to be used alongside
`aiup/aiup-vaadin-jooq`, `aiup/aiup-angular-jpa`, or `aiup/aiup-blazor-dotnet`.

## Skills

Each skill is also available as a slash command.

| Phase        | Skill / command      | Description                                                            |
|--------------|----------------------|------------------------------------------------------------------------|
| Construction | `/drizzle-migration` | Edit the Drizzle schema from the entity model and generate the SQL     |
| Construction | `/implement`         | Implement a use case across the NestJS API and the Next.js frontend    |
| Construction | `/nest-test`         | Vitest unit specs and Supertest e2e specs on Testcontainers PostgreSQL |
| Construction | `/react-test`        | Vitest + React Testing Library component tests                        |
| Construction | `/playwright-test`   | Playwright browser end-to-end tests, driven by `TC-*.md` where present |

### Workflow

```
Construction
──────────────────────────────────────────────────────
/drizzle-migration  →  /implement  →  /nest-test
                                   ↘  /react-test
                                   ↘  /playwright-test
```

All five skills read the AI Unified Process artifacts under `docs/` and share one layout-detection reference,
[`skills/implement/references/project-layout.md`](skills/implement/references/project-layout.md),
which resolves where the two applications live and which conventions the project already follows
before any code is written.

## MCP servers

| Server     | Purpose                                     |
|------------|---------------------------------------------|
| Playwright | Browser automation for end-to-end tests     |

NestJS, Drizzle, Next.js, React, Vitest, Supertest and Testcontainers documentation is already
covered by `aiup-core`'s **context7** MCP server, which resolves docs for any npm package on
demand. See [`rules/mcp-servers.md`](rules/mcp-servers.md) for setup details.

## Installation

Install from the Tessl registry (install the core plugin too, if you haven't already):

```
tessl install aiup/aiup-core
tessl install aiup/aiup-nestjs-nextjs
```

## Prerequisites

- [`aiup/aiup-core`](https://registry.tessl.io/aiup/aiup-core) installed, with an entity model and
  use case specifications already produced under `docs/`
- A NestJS backend using Drizzle ORM over PostgreSQL, with `drizzle.config.ts` present
- A Next.js frontend using the App Router
- Docker running, for the Testcontainers-backed e2e tests
- Optional Playwright MCP server configured per [`rules/mcp-servers.md`](rules/mcp-servers.md)

## Project structure

```
your-project/
├── docs/
│   ├── entity_model.md
│   ├── use_cases/UC-*.md
│   └── test_cases/TC-*.md
├── apps/api/
│   ├── src/database/schema.ts        ← edited by /drizzle-migration
│   ├── drizzle/migrations/           ← generated by /drizzle-migration
│   ├── src/<feature>/                ← produced by /implement
│   │   ├── <feature>.module.ts
│   │   ├── <feature>.controller.ts
│   │   ├── <feature>.service.ts
│   │   ├── <feature>.repository.ts
│   │   └── dto/
│   ├── src/**/*.spec.ts              ← produced by /nest-test (unit)
│   └── test/**/*.e2e-spec.ts         ← produced by /nest-test (e2e)
└── apps/web/
    ├── src/app/<route>/page.tsx      ← produced by /implement
    ├── src/**/*.test.tsx             ← produced by /react-test
    └── e2e/*.spec.ts                 ← produced by /playwright-test
```

**This layout is detected, not required.** A project with different app locations, no workspace
split, or its page components behind a `views/` indirection works fine — the skills read the
project's own conventions and follow them rather than imposing the shape above.

## License

Apache-2.0 · © [Swift Ugandan](https://unifiedprocess.ai)
