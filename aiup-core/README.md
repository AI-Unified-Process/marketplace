<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# aiup-core

`aiup-core` is the stack-independent foundation of the
[AI Unified Process](https://unifiedprocess.ai). It turns a product vision into requirements, an entity model, use
cases, and test journeys that stack-specific plugins can implement.

Use this plugin for every AI Unified Process project. It works with any programming language because its output boundary is a set of
reviewable files under `docs/`.

## Skills and workflow

| Phase        | Skill                                                   | Result                                                         |
|--------------|---------------------------------------------------------|----------------------------------------------------------------|
| Inception    | [`/requirements`](skills/requirements/SKILL.md)         | Requirements catalog derived from `docs/vision.md`             |
| Elaboration  | [`/entity-model`](skills/entity-model/SKILL.md)         | Mermaid entity model and attribute definitions                 |
| Elaboration  | [`/use-case-diagram`](skills/use-case-diagram/SKILL.md) | PlantUML diagram of actors and use cases                       |
| Construction | [`/use-case-spec`](skills/use-case-spec/SKILL.md)       | One detailed specification per use case                        |
| Construction | [`/test-case`](skills/test-case/SKILL.md)               | Executable journey across multiple specified use cases         |
| Any          | [`/reverse-engineer`](skills/reverse-engineer/SKILL.md) | Entity and use case documentation recovered from existing code |

```text
Inception          Elaboration                             Construction 
─────────────     ───────────────────────────────────     ─────────────────────────────
/requirements  →  /entity-model  →  /use-case-diagram  →  /use-case-spec  →  /test-case
```

Each skill reads the artifacts created by earlier steps. The linked `SKILL.md` files are the authoritative reference
for detailed inputs, outputs, and behavior.

## Installation

### Tessl

Initialize the project once:

```sh
tessl init --agent agents
```

`agents` is the vendor-neutral layout; use `claude-code`, `cursor`, `gemini`, `codex`, `copilot`, or `copilot-vscode`
for a specific host. Then install the plugin:

```sh
tessl install ai-unified-process/aiup-core
```

Depending on the configured agent, skills may be exposed as slash commands or invoked by intent, for example
"create the requirements catalog".

### Claude Code

```text
/plugin marketplace add ai-unified-process/marketplace
/plugin install aiup-core
```

See the marketplace [installation guides](../docs/getting-started.md) for other agents and manual adoption.

## Prerequisites

For the forward workflow, create `docs/vision.md` in the target project. It should describe the product mission,
target users, goals, scope, and constraints. The marketplace provides a
[vision template](../docs/templates/vision.md).

Existing projects can begin with `/reverse-engineer` instead of a vision document.

## Inputs and generated artifacts

```text
your-project/
└── docs/
    ├── vision.md                    # maintained by the team
    ├── requirements.md              # /requirements
    ├── entity_model.md              # /entity-model
    ├── use_cases.puml               # /use-case-diagram
    ├── use_cases/
    │   └── UC-001-*.md              # /use-case-spec
    └── test_cases/
        └── TC-001-*.md              # /test-case
```

Review and commit these files with the source code. Stack plugins consume the entity model, use case specifications,
and test journeys without depending on which coding agent produced them.

## Project structure

`aiup-core` does not impose a source-code layout. It writes only to the documentation paths above and inspects an
existing source tree when `/reverse-engineer` runs. The selected stack plugin detects or documents the implementation
layouts it supports.

## MCP servers

| Server     | Purpose                                                          |
|------------|------------------------------------------------------------------|
| `context7` | Current language, framework, and library documentation on demand |

## Related documentation

- [Getting started](../docs/getting-started.md)
- [Workflow and artifacts](../docs/workflow.md)
- [Project setup](../docs/guides/project-setup.md)
- [Choose a stack plugin](../README.md#choose-your-plugins)

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
