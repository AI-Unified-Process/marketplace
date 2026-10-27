<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-angular

`aiup-angular` is the AI Unified Process layer plugin for an [Angular](https://angular.dev) client: the **UI layer**
of a project that combines one plugin per layer with [`aiup-core`](../aiup-core/). It builds the pages, components,
and HTTP services of a use case on top of the REST API the API layer provides, and tests them with Vitest.

Angular is a client-side UI: it talks to the backend only over HTTP, so a project with this plugin always has an
API layer as well (for example `spring-rest` of `aiup-spring-boot`). The TypeScript models are written field by
field from that layer's DTOs, and the JSON contract between the two is checked after every implementation.

## Skills

| Layer | Skill                                                 | Result                                                                                   |
|-------|-------------------------------------------------------|------------------------------------------------------------------------------------------|
| UI    | [`/angular-ui`](skills/angular-ui/SKILL.md)           | Standalone pages and components, `signal()` state, HttpClient services and DTO models, routes |
| UI    | [`/angular-ui-test`](skills/angular-ui-test/SKILL.md) | Vitest component and service tests with TestBed and HttpTestingController, `UC-XXX-<slug>.spec.ts` |

The skills are normally run by `aiup-core`, not one by one:

```text
/stack        # records Angular as the UI layer in docs/architecture/stack.md
/use-case-implement UC-001 # … → spring-rest → angular-ui
/use-case-test UC-001      # … → spring-rest-test → angular-ui-test → playwright-e2e-test
/use-case-coverage UC-001  # the one audit, using the markers these skills keep in docs/architecture/stack.md
```

Each skill can also be run directly (`/angular-ui UC-001`); it then reads the same inputs and applies the same rules
as `/use-case-implement` or `/use-case-test`, works on the UI layer only, and ends with a `Next:` line.

## Combinations

| Project                   | Plugins next to `aiup-core`                                                      |
|---------------------------|----------------------------------------------------------------------------------|
| Angular, Spring Boot, JPA | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`, `aiup-angular`, `aiup-playwright` |

Any persistence plugin works below the API layer (`aiup-jooq` instead of `aiup-jpa`). Browser tests of the running
application come from [`aiup-playwright`](../aiup-playwright/).

## Installation

### Tessl

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-angular
```

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-angular
```

Install the other layer plugins of the project the same way. Do not combine layer plugins with a combined stack
plugin (`aiup-angular-jpa`) in one project. See the [installation guides](../docs/installation/) for other
agents.

## Prerequisites

- `aiup-core` 3.3.0 or later, and `docs/architecture/stack.md` written by `/stack`.
- An Angular project using standalone components; Vitest through `@angular/build:unit-test` (or a Vitest config).
- An API layer plugin that hands over its endpoints and DTOs.

## MCP servers

| Server     | Purpose                                                   |
|------------|-----------------------------------------------------------|
| `context7` | Current Angular, RxJS, and Vitest documentation on demand |

## Related documentation

- [Getting started](../docs/getting-started.md)
- [Workflow and artifacts](../docs/workflow.md)
- [`aiup-core`](../aiup-core/)

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
