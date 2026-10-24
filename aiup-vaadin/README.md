<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-vaadin

`aiup-vaadin` is the AI Unified Process layer plugin for the **UI** and **E2E** layers of a
[Vaadin](https://vaadin.com) application. It builds and tests the views of a use case — server-side Java views with
Vaadin Flow, or React views with Hilla — on top of the service layer, and automates use cases and test case
journeys in the browser with Playwright and Drama Finder.

It is one plugin of a layered setup: a project combines `aiup-core` with one plugin per layer. The skills are
driven by `aiup-core` and need **`aiup-core` 3.0.0 or later**:

- `/stack` records in `docs/architecture/stack.md` which skill builds and tests each layer
- `/use-case-implement UC-XXX` runs the implementation skills bottom-up and hands each layer the Handover of the one below
- `/use-case-test UC-XXX` runs the test skills from the integration layer up — for a Flow UI the
  Browserless tests, which run against the real service and database, so no service or repository tests are
  written below them; behind a Hilla UI the service tests
- `/use-case-coverage UC-XXX` audits the use case against the markers this plugin writes into the Markers table

Every skill can also be run directly.

## Skills

| Layer | Skill                                                         | Result                                                                      |
|-------|---------------------------------------------------------------|-----------------------------------------------------------------------------|
| UI    | [`/vaadin-flow-ui`](skills/vaadin-flow-ui/SKILL.md)           | `@Route` views, lazy grids, Binder forms, dialogs, notifications            |
| UI    | [`/hilla-ui`](skills/hilla-ui/SKILL.md)                       | `@BrowserCallable` endpoint delegating to the service, and the React view   |
| UI    | [`/vaadin-flow-ui-test`](skills/vaadin-flow-ui-test/SKILL.md) | Browserless view tests `UC<id><Name>Test` with `@UseCase`                   |
| UI    | [`/hilla-ui-test`](skills/hilla-ui-test/SKILL.md)             | Vitest view tests `UC-XXX-<slug>.test.tsx` with the endpoint client mocked; one Java endpoint contract test (access, messages) |
| E2E   | [`/vaadin-e2e-test`](skills/vaadin-e2e-test/SKILL.md)         | Playwright + Drama Finder tests for a `UC-*` or a `TC-*` journey            |

A project uses either the Flow pair or the Hilla pair for its UI layer; `/vaadin-e2e-test` works with both.

## Combinations

| Project           | Plugins next to `aiup-core`                                   |
|-------------------|---------------------------------------------------------------|
| Vaadin Flow, jOOQ | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin` |
| Hilla, jOOQ       | `aiup-flyway`, `aiup-jooq`, `aiup-spring-boot`, `aiup-vaadin` |

Replace `aiup-jooq` with `aiup-jpa` for a JPA persistence layer. The views call the service layer of
`aiup-spring-boot` directly and need no API layer — Hilla's endpoint is part of `/hilla-ui`. A REST API
(`/spring-rest`) may still exist for other clients; it then tests only its own contract, and the integration layer
stays the Browserless tests of a Flow UI or the service tests behind a Hilla UI.

This plugin replaces the UI and test half of the combined `aiup-vaadin-jooq` plugin for layered projects. Karibu
Testing is not carried over; Browserless Testing supersedes it.

## Installation

### Tessl

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-spring-boot
tessl install ai-unified-process/aiup-vaadin
```

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-vaadin
```

Claude Code installs `aiup-core` and `aiup-spring-boot` with this plugin; Tessl does not, so name them as above.
Install the plugins of the other layers (`aiup-flyway`, `aiup-jooq` or `aiup-jpa`) the same way. Do not combine
layer plugins with the combined `aiup-vaadin-jooq` plugin in one project. See the marketplace
[installation guides](../docs/installation/) for other agents and manual adoption.

## MCP servers

The plugin configures the Vaadin documentation server and the Playwright server; both are optional. See
[`rules/mcp-servers.md`](rules/mcp-servers.md).

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
