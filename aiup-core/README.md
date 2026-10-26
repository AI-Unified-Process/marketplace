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

| Phase        | Skill                                                         | Result                                                                       |
|--------------|---------------------------------------------------------------|------------------------------------------------------------------------------|
| Inception    | [`/requirements`](skills/requirements/SKILL.md)               | Requirements catalog derived from `docs/vision.md`                           |
| Elaboration  | [`/entity-model`](skills/entity-model/SKILL.md)               | Mermaid entity model and attribute definitions                               |
| Elaboration  | [`/use-case-diagram`](skills/use-case-diagram/SKILL.md)       | PlantUML diagram of actors and use cases                                     |
| Elaboration  | [`/business-process`](skills/business-process/SKILL.md)       | BPMN business process models (`BP-XXX`) connecting the use cases             |
| Construction | [`/use-case-spec`](skills/use-case-spec/SKILL.md)             | One detailed specification per use case                                      |
| Construction | [`/test-case`](skills/test-case/SKILL.md)                     | Executable journeys across specified use cases or BPMN process paths         |
| Any          | [`/spec-review`](skills/spec-review/SKILL.md)                 | Deterministic lint and advisory review of the specification quality          |
| Any          | [`/open-questions`](skills/open-questions/SKILL.md)           | `docs/open-questions.md`: the questions the specification does not answer yet |
| Any          | [`/architecture-decision`](skills/architecture-decision/SKILL.md) | Architecture decision records (`ADR-XXX`), each linked to the NFRs and constraints it serves |
| Any          | [`/reverse-engineer`](skills/reverse-engineer/SKILL.md)       | Entity and use case documentation recovered from existing code               |
| Construction | [`/stack`](skills/stack/SKILL.md)                             | `docs/architecture/stack.md`: the layer skill for each technical layer       |
| Construction | [`/use-case-implement`](skills/use-case-implement/SKILL.md)   | A use case implemented by running the layer skills bottom-up, within the decision rights |
| Construction | [`/use-case-test`](skills/use-case-test/SKILL.md)             | The tests of a use case, from the integration layer up                       |
| Construction | [`/use-case-coverage`](skills/use-case-coverage/SKILL.md)     | Read-only coverage matrix of a use case against code and tests               |
| Construction | [`/test-case-implement`](skills/test-case-implement/SKILL.md) | The automated end-to-end test of a test case journey                         |
| Construction | [`/test-case-coverage`](skills/test-case-coverage/SKILL.md)   | Read-only coverage matrix of a test case journey                             |
| Transition   | [`/user-guide`](skills/user-guide/SKILL.md)                   | `docs/user_guide/`: one chapter per actor from the accepted use cases        |
| Transition   | [`/acceptance-protocol`](skills/acceptance-protocol/SKILL.md) | `docs/acceptance/<round>.md`: the acceptance checklist; accepted use cases go to `Done` |
| Transition   | [`/release-notes`](skills/release-notes/SKILL.md)             | `docs/release-notes.md`: the use cases that reached `Done` since a Git tag   |

```text
Inception          Elaboration                             Construction                            Transition
─────────────     ───────────────────────────────────     ───────────────────────────────────     ─────────────────────
/requirements  →  /entity-model  →  /use-case-diagram  →  /use-case-spec  →  /test-case        →  /acceptance-protocol
                                                    └→  /business-process  ↗                      /user-guide
                                                                                                  /release-notes
```

The last six skills drive the layer plugins (`aiup-flyway`, `aiup-jooq`, `aiup-jpa`, `aiup-spring-boot`,
`aiup-vaadin`, `aiup-angular`, `aiup-playwright`), which require `aiup-core` 3.3.0 or later (`aiup-playwright`: 3.2.0): install one per layer of
your project, run `/stack` once,
then `/use-case-implement UC-001`, `/use-case-test UC-001`, and `/use-case-coverage UC-001`; a journey goes
through `/test-case-implement TC-001` and `/test-case-coverage TC-001`. `/use-case-coverage` delegates to the read-only
[`uc-coverage-layered`](agents/uc-coverage-layered.md) sub-agent. With a combined stack plugin, use its own
`/implement` and test skills instead.

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

See the marketplace [installation guides](../docs/installation/) for other agents and manual adoption.

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
    ├── glossary.md                  # /requirements (domain terms and synonyms to avoid)
    ├── entity_model.md              # /entity-model
    ├── use_cases.puml               # /use-case-diagram
    ├── architecture/
    │   └── stack.md                 # /stack (layer plugins only)
    ├── processes/
    │   └── BP-001-*.bpmn            # /business-process (optional), read by /test-case
    ├── use_cases/
    │   └── UC-001-*.md              # /use-case-spec
    └── test_cases/
        └── TC-001-*.md              # /test-case
```

`/spec-review` checks these files against each other. Its bundled script `spec_lint.py` needs only Python and can
run as a blocking CI gate; accepted findings of an existing project go into `docs/.spec-lint-baseline.json`.
`/spec-review report` writes `docs/spec-report.html`: requirement coverage, the traceability matrix, and the findings
on one page. `/spec-review impact FR-014` lists what a change to a requirement, business rule, or use case affects
before anything is edited, with the trace behind each hit and the skills that carry the change through.

Review and commit these files with the source code. Layer and stack plugins consume the entity model, use case
specifications, and test journeys without depending on which coding agent produced them.

## Project structure

`aiup-core` does not impose a source-code layout. Its specification skills write only to the documentation paths
above and inspect an existing source tree when `/reverse-engineer` runs; `/stack` writes the stack file
under `docs/architecture/`. The construction orchestrators `/use-case-implement`, `/use-case-test`, and
`/test-case-implement` produce code and tests, but only by running the layer skills that
`docs/architecture/stack.md` names — the layout is theirs, not core's. `/use-case-coverage` and
`/test-case-coverage` only read. The installed layer plugins, or the selected combined stack plugin, detect or
document the implementation layouts they support.

## MCP servers

| Server     | Purpose                                                          |
|------------|------------------------------------------------------------------|
| `context7` | Current language, framework, and library documentation on demand |

## Related documentation

- [Getting started](../docs/getting-started.md)
- [Workflow and artifacts](../docs/workflow.md)
- [Project setup](../docs/guides/project-setup.md)
- [Writing a layer skill](../docs/guides/layer-skill.md)
- [Choose a stack plugin](../README.md#choose-your-plugins)

## License

Apache-2.0 · © 2025-2026 [Simon Martinelli](https://unifiedprocess.ai) and the AI Unified Process contributors

See [LICENSE](LICENSE) and [NOTICE](NOTICE). "AI Unified Process" identifies the original
methodology; derived works must retain the NOTICE file and must not present themselves as the
official AI Unified Process.
