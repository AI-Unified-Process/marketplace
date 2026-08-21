<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Workflow and artifacts

The AI Unified Process is a requirements-first development workflow adapted from the phases of the
[Rational Unified Process](https://en.wikipedia.org/wiki/Rational_unified_process). AI Unified Process keeps product intent in
versioned, human-reviewable artifacts that every later step consumes.

## Workflow

```text
Inception          Elaboration                            Construction
─────────────     ───────────────────────────────────     ─────────────────────────────────
/requirements  →  /entity-model  →  /use-case-diagram  →  /use-case-spec  →  migration
                                                                          ↘  implementation
                                                                          ↘  tests
```

`aiup-core` owns the stack-independent steps. A stack plugin owns migrations, implementation, and tests. The boundary
between them is the set of files under `docs/`, not a specific coding agent.

## Artifact flow

| Artifact                  | Produced by         | Consumed by                        |
|---------------------------|---------------------|------------------------------------|
| `docs/vision.md`          | Product team        | `/requirements`                    |
| `docs/requirements.md`    | `/requirements`     | Entity model and use case diagram  |
| `docs/entity_model.md`    | `/entity-model`     | Migrations and implementations     |
| `docs/use_cases.puml`     | `/use-case-diagram` | `/use-case-spec` and reviewers     |
| `docs/use_cases/UC-*.md`  | `/use-case-spec`    | Implementations and use case tests |
| `docs/test_cases/TC-*.md` | `/test-case`        | End-to-end journey tests           |

Every artifact is a review point. Correcting an intermediate document is expected and is safer than compensating for
an incorrect assumption in generated code.

## Traceability

AI Unified Process uses stable identifiers to preserve the path from intent to tests:

- Functional requirements use `FR-XXX`; non-functional requirements use `NFR-XXX`; constraints use `C-XXX`.
- Use cases use `UC-XXX` and reference the functional requirements they realize.
- Test cases use `TC-XXX` and reference the use cases in their journey.
- Generated tests retain the applicable `UC-*` or `TC-*` identifier in their name or metadata.

Do not reuse an identifier for a different concern after it has been committed. When a requirement changes, update it
and rerun or reconcile the downstream artifacts that depend on it.

## Core skills

| Skill                                                                | Result                                                          |
|----------------------------------------------------------------------|-----------------------------------------------------------------|
| [`/requirements`](../aiup-core/skills/requirements/SKILL.md)         | Requirements catalog derived from `docs/vision.md`              |
| [`/entity-model`](../aiup-core/skills/entity-model/SKILL.md)         | Mermaid entity model and attribute definitions                  |
| [`/use-case-diagram`](../aiup-core/skills/use-case-diagram/SKILL.md) | PlantUML diagram of actors and use cases                        |
| [`/use-case-spec`](../aiup-core/skills/use-case-spec/SKILL.md)       | One detailed specification per use case                         |
| [`/test-case`](../aiup-core/skills/test-case/SKILL.md)               | Executable user journey across specified use cases              |
| [`/reverse-engineer`](../aiup-core/skills/reverse-engineer/SKILL.md) | AI Unified Process baseline recovered from an existing codebase |

The linked `SKILL.md` files are the authoritative descriptions of inputs, outputs, and behavior.

## Working with changes

When product intent changes:

1. Update `docs/vision.md` or the relevant requirement.
2. Reconcile `docs/requirements.md` and keep existing identifiers stable.
3. Revisit the entity model and use case diagram if the domain or user goals changed.
4. Update affected use case and test case documents.
5. Reconcile migrations, implementation, and tests through the selected stack plugin.

Commit `docs/` with the source code. These files explain why the implementation exists and make reviews, onboarding,
and later regeneration reproducible.

## Existing codebases

`/reverse-engineer` inspects entry points, data models, authorization, and integrations to recover the same entity and
use case artifacts produced by the forward workflow. It groups behavior by user goal rather than by endpoint and
reports code it cannot classify. Treat the result as a proposed baseline: resolve gaps and contradictions before
continuing with construction skills.

## Project guidance

Agent instruction files should tell the coding agent to read the AI Unified Process artifacts before making product or architecture
decisions. See [Project setup](guides/project-setup.md) for a generic project tree and reusable templates.
