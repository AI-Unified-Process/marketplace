<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-playwright

`aiup-playwright` is the AI Unified Process layer plugin for **end-to-end tests** with
[Playwright](https://playwright.dev) in TypeScript: the **E2E layer** of a project that combines one plugin per
layer with [`aiup-core`](../aiup-core/). It tests the running application in a real browser — a single use case
(`UC-*`), or a test case journey (`TC-*`) that chains several use cases.

It works with any web UI that renders semantic HTML and ARIA — Angular today, other client-side frameworks alike —
because it locates elements by role, label, and text. A Vaadin UI has its own E2E skill, `vaadin-e2e-test` in
`aiup-vaadin`.

## Skills

| Layer | Skill                                                         | Result                                                                                         |
|-------|---------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| E2E   | [`/playwright-e2e-test`](skills/playwright-e2e-test/SKILL.md) | `UC-XXX-<slug>.spec.ts` with one test per scenario, or `TC-XXX-<slug>.spec.ts` with one `test.step` per Flow row |

The skill is normally run by `aiup-core`:

```text
/stack                # records Playwright as the E2E layer in docs/architecture/stack.md
/use-case-test UC-001        # … → angular-ui-test → playwright-e2e-test
/test-case-implement TC-001  # a journey runs the E2E layer only
/test-case-coverage TC-001   # the one audit, using the markers the skill keeps in docs/architecture/stack.md
```

It can also be run directly (`/playwright-e2e-test TC-001`); it then applies the same rules as `/use-case-test` and ends
with a `Next:` line. The E2E layer has no implementation skill — `/use-case-implement` does not run it.

## Combinations

| Project                   | Plugins next to `aiup-core`                                                      |
|---------------------------|----------------------------------------------------------------------------------|
| Angular, Spring Boot, JPA | `aiup-flyway`, `aiup-jpa`, `aiup-spring-boot`, `aiup-angular`, `aiup-playwright` |

## Installation

### Tessl

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-playwright
```

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-playwright
```

Do not combine layer plugins with a combined stack plugin (`aiup-angular-jpa`) in one project. See the
[installation guides](../docs/installation/) for other agents.

## Prerequisites

- `aiup-core` 3.2.0 or later, and `docs/architecture/stack.md` written by `/stack`.
- Node.js and `@playwright/test` (the skill sets it up when the project has no E2E tooling yet).
- The application running locally, with seed data that satisfies the preconditions of the use cases and test cases.

## MCP servers

| Server       | Purpose                                                          |
|--------------|------------------------------------------------------------------|
| `context7`   | Current `@playwright/test` documentation on demand               |
| `playwright` | Browser automation for exploring the running application and debugging locators |

See [`rules/mcp-servers.md`](rules/mcp-servers.md) for setup details.

## Related documentation

- [Getting started](../docs/getting-started.md)
- [Workflow and artifacts](../docs/workflow.md)
- [`aiup-core`](../aiup-core/)

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
