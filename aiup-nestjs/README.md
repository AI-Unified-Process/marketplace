<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-nestjs

`aiup-nestjs` is the AI Unified Process layer plugin for the **service** and **API** layers of a
[NestJS](https://nestjs.com) application: the business logic with its rules and domain errors, and a REST API with
class-validator DTOs and RFC 9457 Problem Details, each with its test skill.

It is one layer of a stack, not a stack. Combine it with `aiup-core` (3.16.1 or later) and one plugin per other layer
of your project. `/stack` records which plugin builds which layer in `docs/architecture/stack.md`; `/use-case-implement`,
`/use-case-test`, and `/use-case-coverage` run the layer skills from there.

The skills derive from the deprecated combined plugin [`aiup-nestjs-nextjs`](../aiup-nestjs-nextjs/), written by a contributor to
the AI Unified Process, which this plugin and `aiup-drizzle` and `aiup-nextjs` supersede.

## Skills

| Layer   | Skill                                                       | Result                                                                                    |
|---------|-------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Service | [`/nest-service`](skills/nest-service/SKILL.md)             | `@Injectable()` services, business rules with markers, domain errors, the feature module  |
| API     | [`/nest-rest`](skills/nest-rest/SKILL.md)                   | Controllers, class-validator DTOs, mapped response types, Problem Details, status codes; an agreed OpenAPI operation built as written |
| Service | [`/nest-service-test`](skills/nest-service-test/SKILL.md)   | `UC-001-<slug>.service-spec.ts`: every business rule allowed and rejected, against a real database |
| API     | [`/nest-rest-test`](skills/nest-rest-test/SKILL.md)         | `UC-001-<slug>.e2e-spec.ts`: statuses, JSON contract, error bodies, through the full stack with Supertest |

Each skill is normally run by `/use-case-implement UC-XXX` or `/use-case-test UC-XXX`, which pass the **Handover** of the
layer below to the next. Each can also be run directly, for example `/nest-rest UC-001` to change only the API of a use
case.

**The service and test skills assume the Drizzle persistence layer** that `/drizzle-persistence` of `aiup-drizzle`
builds: the transaction rules, the constraint violation handling, and the shared test setup are written for it. On
another persistence technology (Prisma, TypeORM) `/nest-service` follows that layer's Handover for those parts
and says so, and the test skills stop before writing a Drizzle setup and report what the project uses. `/nest-rest`
depends on no persistence technology.

Three TypeScript-specific concerns are handled explicitly:

- A NestJS project on ESM and NodeNext needs a `.js` suffix on every relative import, even though the source is
  TypeScript; a project on other module settings must not get one.
- NestJS dependency injection needs decorator metadata. Below Vite 8, Vitest's esbuild transformer does not emit it and
  the project needs `unplugin-swc`; from Vite 8, Oxc reads it from `tsconfig.json`. The test skills check this first.
- The test skills write Vitest specs. `nest new` scaffolds Vitest for an ESM project from NestJS 12 and Jest for a
  CommonJS project (and for every project through NestJS 11): in a project whose runner is Jest, the test skills ask
  before they add a second runner, and write for Jest when that is the answer.

## Combinations

| Project                       | Plugins next to `aiup-core`                                     |
|-------------------------------|-----------------------------------------------------------------|
| REST API, NestJS, Drizzle     | `aiup-drizzle`, `aiup-nestjs`                                   |
| Next.js, NestJS, Drizzle      | `aiup-drizzle`, `aiup-nestjs`, `aiup-nextjs`, `aiup-playwright` |

A use case is tested once, in the integration layer of the entry layer it is offered through, which `/stack` records in
the Integration layer table of `docs/architecture/stack.md`:

| Project                 | Integration layer | What this plugin's test skills write                                       |
|-------------------------|-------------------|----------------------------------------------------------------------------|
| REST API only, or Next.js | API             | `/nest-rest-test`: every business rule; `/nest-service-test` nothing new   |
| No entry layer          | Service           | `/nest-service-test`: every business rule                                  |

Both test skills run in process against PostgreSQL in Testcontainers, so Docker is required. The shared setup, including
the per-use-case seed `test/data/uc<id>-<slug>.ts` that the E2E tests load too, is
[`test-setup.md`](skills/nest-service-test/references/test-setup.md).

This plugin ships no Client layer skill. For a use case that calls an external system, `/stack` records the technology
that calls it, `/use-case-implement` builds the port and its adapter itself, `/nest-service` calls the port, and the
integration layer's test skill writes the fake of the port that stands in for the system in every test.

## Installation

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-nestjs
```

`aiup-core` is installed with it as a plugin dependency.

### Tessl

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-nestjs
```

Tessl does not install dependencies, so name `aiup-core` too. See the marketplace
[installation guides](../docs/installation/) for other agents and manual adoption.

## Prerequisites

- `aiup-core` and a reviewed `docs/use_cases/UC-*.md`, with `/stack` run once.
- A NestJS application, and Docker for the Testcontainers-backed tests.

## MCP servers

The plugin configures the optional `context7` MCP server for NestJS, Vitest, Supertest, and Testcontainers documentation.
The skills work without it.

## Related documentation

- [Writing a layer skill](../docs/guides/layer-skill.md)
- [Workflow and artifacts](../docs/workflow.md)
- [Moving from a combined stack plugin](../docs/migration.md)

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
