<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-blazor-dotnet

`aiup-blazor-dotnet` is the AI Unified Process construction plugin for C#, Blazor, and Entity Framework Core on .NET 10. It turns
the entity model and use case specifications produced by [`aiup-core`](../aiup-core/) into EF Core migrations,
Vertical Slice features, and tests using bUnit, xUnit, and Playwright.

This plugin is designed to continue from the specifications produced by `aiup-core`. For the complete AI Unified Process workflow,
use it alongside `aiup-core` and select one stack plugin.

## Skills and workflow

| Phase        | Skill                                                 | Result                                                     |
|--------------|-------------------------------------------------------|------------------------------------------------------------|
| Construction | [`/ef-migration`](skills/ef-migration/SKILL.md)       | EF Core entities, configurations, and generated migrations |
| Construction | [`/implement`](skills/implement/SKILL.md)             | Blazor use case implemented as a Vertical Slice            |
| Construction | [`/bunit-test`](skills/bunit-test/SKILL.md)           | Browserless component tests for `.razor` pages             |
| Construction | [`/dotnet-test`](skills/dotnet-test/SKILL.md)         | Backend unit and relational integration tests              |
| Construction | [`/playwright-test`](skills/playwright-test/SKILL.md) | Native C# browser tests for `UC-*` or `TC-*` journeys      |

```text
Construction
─────────────────────────────────────────────────
/ef-migration  →  /implement  →  /bunit-test
                              ↘  /dotnet-test
                              ↘  /playwright-test
```

The linked `SKILL.md` files are the authoritative reference for detailed inputs, outputs, and behavior.

## Installation

### Tessl

Initialize the project once:

```sh
tessl init --agent agents
```

`agents` is the vendor-neutral layout; use `claude-code`, `cursor`, `gemini`, `codex`, `copilot`, or `copilot-vscode`
for a specific host. Then install the plugins:

```sh
tessl install ai-unified-process/aiup-core
tessl install ai-unified-process/aiup-blazor-dotnet
```

Depending on the configured agent, skills may be exposed as slash commands or invoked by intent, for example
"implement UC-001".

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
/plugin install aiup-blazor-dotnet
```

See the marketplace [installation guides](../docs/getting-started.md) for other agents and manual adoption.

## Prerequisites

- `aiup-core` and reviewed `docs/entity_model.md` plus `docs/use_cases/UC-*.md` artifacts.
- A .NET 10 solution or project using Blazor and Entity Framework Core.
- A configured relational database provider and EF Core tooling for migrations.
- Node.js and installed Playwright browsers when browser tests are generated.
- Optional MCP servers configured through [`rules/mcp-servers.md`](rules/mcp-servers.md).

## Inputs and generated artifacts

The plugin consumes the core documentation under `docs/`. It updates EF Core persistence types, creates migration
files, implements a feature folder per use case, and places bUnit, backend, and browser tests in the solution's test
projects.

## Project structure

```text
your-solution/
├── docs/
│   ├── entity_model.md
│   ├── use_cases/UC-*.md
│   └── test_cases/TC-*.md
├── <Application>/
│   ├── Data/                            # DbContext and EF configurations
│   ├── Migrations/                      # /ef-migration
│   └── Features/
│       └── UCXXX_<FeatureName>/         # /implement
├── <Application>.Tests/                 # /bunit-test and /dotnet-test
└── <Application>.Tests.E2E/             # /playwright-test
```

A feature folder can contain the Blazor page, code-behind, scoped CSS, command or query, handler, and validator. The
skills inspect existing project and test conventions before selecting exact names and paths.

## MCP servers

| Server           | Purpose                                                       |
|------------------|---------------------------------------------------------------|
| `MicrosoftLearn` | Current .NET, Blazor, and Entity Framework Core documentation |
| `bUnitDocs`      | bUnit component-testing documentation                         |
| `playwright`     | Browser automation                                            |

See [`rules/mcp-servers.md`](rules/mcp-servers.md) for setup details.

## Related documentation

- [Getting started](../docs/getting-started.md)
- [Workflow and artifacts](../docs/workflow.md)
- [`aiup-core`](../aiup-core/)

## License

Apache-2.0 · © 2025-2026 [Carl J. Mosca](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
