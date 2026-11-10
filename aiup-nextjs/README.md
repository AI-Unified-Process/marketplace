<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-nextjs

`aiup-nextjs` is the AI Unified Process layer plugin for a [Next.js](https://nextjs.org) App Router client: the **UI
layer** of a project that combines one plugin per layer with [`aiup-core`](../aiup-core/). It builds the routes and
components of a use case on top of the REST API the API layer provides, and tests them with Vitest and React Testing
Library.

In this stack Next.js is a client-side UI: it talks to the backend only over HTTP, so a project with this plugin always
has an API layer as well, `nest-rest` of `aiup-nestjs` or `spring-rest` of `aiup-spring-boot`. The contract types are
written field by field from that layer's DTOs, and the JSON contract between the two is checked after every
implementation. Server Components and Server Actions reach data through the same API, never through a database.

The skills derive from the deprecated combined plugin [`aiup-nestjs-nextjs`](../aiup-nestjs-nextjs/), which a contributor wrote.

## Skills

| Layer | Skill                                               | Result                                                                                     |
|-------|-----------------------------------------------------|--------------------------------------------------------------------------------------------|
| UI    | [`/nextjs-ui`](skills/nextjs-ui/SKILL.md)           | Routes, client components, contract types, calls to the API through relative `/api` paths  |
| UI    | [`/nextjs-ui-test`](skills/nextjs-ui-test/SKILL.md) | Vitest and React Testing Library component tests, `<Component>.test.tsx`                   |

The skills are normally run by `aiup-core`, not one by one:

```text
/stack        # records Next.js as the UI layer in docs/architecture/stack.md
/use-case-implement UC-001 # … → nest-rest → nextjs-ui
/use-case-test UC-001      # … → nest-rest-test → nextjs-ui-test → playwright-e2e-test
/use-case-coverage UC-001  # the one audit, using the markers these skills keep in docs/architecture/stack.md
```

Each skill can also be run directly (`/nextjs-ui UC-001`); it then reads the same inputs and applies the same rules
as `/use-case-implement` or `/use-case-test`, works on the UI layer only, and ends with a `Next:` line.

A Server Component cannot be rendered in jsdom. `/nextjs-ui-test` reports one as not reachable and leaves it to the E2E
layer, and says so plainly when `**E2E scope:** Test cases only` means no browser test of the use case follows.

## Combinations

| Project                     | Plugins next to `aiup-core`                                                      |
|-----------------------------|----------------------------------------------------------------------------------|
| Next.js, NestJS, Drizzle    | `aiup-drizzle`, `aiup-nestjs`, `aiup-nextjs`, `aiup-playwright`                  |
| Next.js, Spring Boot, JPA   | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`, `aiup-nextjs`, `aiup-playwright`  |

Browser tests of the running application come from [`aiup-playwright`](../aiup-playwright/).

## Installation

### Tessl

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-nextjs
```

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-nextjs
```

Install the other layer plugins of the project the same way. Do not combine layer plugins with a combined stack
plugin (the deprecated `aiup-nestjs-nextjs`) in one project. See the [installation guides](../docs/installation/) for other
agents.

## Prerequisites

- `aiup-core` 3.16.0 or later, and `docs/architecture/stack.md` written by `/stack`.
- A Next.js project using the App Router; Vitest with jsdom and React Testing Library for the tests.
- An API layer plugin that hands over its endpoints and DTOs.

## MCP servers

| Server     | Purpose                                                                  |
|------------|--------------------------------------------------------------------------|
| `context7` | Current Next.js, React, Vitest, and Testing Library documentation on demand |

## Related documentation

- [Getting started](../docs/getting-started.md)
- [Workflow and artifacts](../docs/workflow.md)
- [`aiup-core`](../aiup-core/)

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
