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

| Artifact                  | Produced by         | Consumed by                                        |
|---------------------------|---------------------|----------------------------------------------------|
| `docs/vision.md`          | Product team        | `/requirements`                                    |
| `docs/requirements.md`    | `/requirements`     | Specifications; construction reads the linked rows |
| `docs/glossary.md`        | `/requirements`     | Specifications, implementations, `/spec-review`    |
| `docs/entity_model.md`    | `/entity-model`     | Migrations and implementations                     |
| `docs/use_cases.puml`     | `/use-case-diagram` | `/use-case-spec` and reviewers                     |
| `docs/use_cases/UC-*.md`  | `/use-case-spec`    | Implementations and use case tests                 |
| `docs/processes/*.bpmn`   | Business analysts   | `/test-case` (one test case per path)              |
| `docs/test_cases/TC-*.md` | `/test-case`        | End-to-end journey tests                           |

Every artifact is a review point. Correcting an intermediate document is expected and is safer than compensating for
an incorrect assumption in generated code.
`/use-case-spec` asks first: before it writes a use case, it asks up to five questions whose answers change the
specification and have no reasonable default, writes the answers into the steps and rules, and reports every default
it chose without asking as an assumption.
The `/implement` skills act on this: they ask before implementing a use case that is not yet `Approved`, and they
report each gap in the specification as an open question — naming the step, flow, or rule — instead of closing it
with an assumption. The answer goes into the specification through `/use-case-spec`, not into the code alone.

## Traceability

This section is the traceability convention of the AI Unified Process: every skill of every plugin writes and reads
the identifiers and markers defined here. Stable identifiers preserve two chains:

```text
Requirements catalog         Specification                              Construction
FR-* / NFR-* / C-*   ──→   UC-XXX  ──→  UC-XXX BR-YYY   ──→   implementation  ──→  use case tests
                              ↑
BPMN process  ──→  path  ──→  TC-XXX (chains several use cases)   ──────────────→  journey test
```

The chain starts at the requirements catalog. Requirements engineering is the first discipline that produces
traceable requirements (in German-speaking projects often the *Lastenheft*); a vision document, when there is one,
is prose without identifiers and is not linked. Test cases are not derived from business rules but from business
processes: one test case per path through a BPMN process model.

### Identifiers

| Id        | Artifact                                               | Unique within | Cited elsewhere as |
|-----------|--------------------------------------------------------|---------------|--------------------|
| `FR-XXX`  | Functional requirement, `docs/requirements.md`         | Catalog       | `FR-XXX`           |
| `NFR-XXX` | Non-functional requirement, `docs/requirements.md`     | Catalog       | `NFR-XXX`          |
| `C-XXX`   | Constraint, `docs/requirements.md`                     | Catalog       | `C-XXX`            |
| `UC-XXX`  | Use case, `docs/use_cases/UC-XXX-*.md` and the diagram | Project       | `UC-XXX`           |
| `BR-YYY`  | Business rule, `### BR-YYY:` inside one use case       | Its use case  | `UC-XXX BR-YYY`    |
| `A<n>`    | Alternative flow, `### A<n>:` inside one use case      | Its use case  | `UC-XXX A<n>`      |
| `TC-XXX`  | Test case, `docs/test_cases/TC-XXX-*.md`               | Project       | `TC-XXX`           |

German specifications use `GR-YYY` (*Geschäftsregel*) instead of `BR-YYY`. Business rules are numbered per use case,
so a bare `BR-003` is ambiguous outside its own use case: cite it as `UC-005 BR-003`. A rule that applies to several
use cases is defined once and cited from the others, never copied.

Do not reuse an identifier for a different concern after it has been committed. When a requirement changes, update it
and rerun or reconcile the downstream artifacts that depend on it.

### References

Each reference is written once, in the downstream artifact, pointing upstream. A requirement never lists its use
cases and a use case never lists its test cases; the reverse direction is computed, not maintained by hand.

| From          | To                                 | Written as                                                                    |
|---------------|------------------------------------|-------------------------------------------------------------------------------|
| Use case      | FR, NFR, C                         | The `**Requirements:**` line: the FRs it realizes, the NFRs and Cs that apply |
| Use case      | Another use case's rule            | `UC-XXX BR-YYY` in the text                                                   |
| Test case     | Use cases                          | The Use Case column of the Flow table, linked to the specification            |
| Test case     | Process                            | The `**Process:**` line, linked to the `.bpmn` file, and the path it covers   |
| BPMN activity | Use case                           | The use case id in the activity name, or the same name as the use case title  |
| Code          | Use case, rule                     | The implementation marker below                                               |
| Test          | Use case or test case, flow, rules | The test markers below                                                        |

### Markers in code

**Implementation.** Every stack marks the code that enforces a business rule with a comment in the qualified form,
directly above the method, query condition, or validator that enforces it:

```java
// UC-005 BR-003: A guest must be at least eighteen years old on the day of arrival.
```

The marker names the rule and restates it in one line; it is the place a reader or `/coverage-check` finds the rule
in the code. It is optional in the sense that a missing marker is a traceability gap, not missing behavior: code
written before the convention still counts when its domain vocabulary matches. The implementation skills add it for
every rule they implement. The use case id itself needs no separate marker in production code: Blazor feature
folders carry it (`Features/UC001_<Feature>/`), the other stacks name views, services, and handlers after the use
case's domain, and the tests carry the id.

**Tests.** Each stack carries the ids in the form its test framework supports:

| Stack                | Use case tests (`UC-*`)                                                                                                                                                                                               | Journey tests (`TC-*`)                                                                                      |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `aiup-vaadin-jooq`   | `@UseCase(id = "UC-001", scenario = "A1: …", businessRules = {"BR-003"})` in `UC001<Name>Test` and `UC001<Name>ServiceTest`; `describe('UC-001: …')` in `UC-001-<slug>.test.tsx` (Hilla); Playwright `UC001<Name>IT`  | `TC001<Name>IT` with `@DisplayName("TC-001: …")` and `// Step <n>: <name>` per Flow row                     |
| `aiup-angular-jpa`   | `@UseCase(id = "UC-001", scenario = "A1: …", businessRules = {"BR-003"})` in `UC001<Name>Test`; `describe('UC-001: …')` in `UC-001-<slug>.spec.ts`; Playwright `test.describe('UC-001: …')` with `{ tag: '@UC-001' }` | `TC-001-<slug>.spec.ts` with `test.describe('TC-001: …')`, `{ tag: '@TC-001' }`, `test.step('Step <n>: …')` |
| `aiup-blazor-dotnet` | `[UseCase("UC-001", Scenario = "A1: …", BusinessRules = ["BR-003"])]` in `UC001<Name>Test`, `UC001<Name>HandlerTest`, and `UC001<Name>IT`                                                                             | `TC001<Name>IT` with `[Fact(DisplayName = "TC-001: …")]` and `// Step <n>: <name>` per Flow row             |
| `aiup-nestjs-nextjs` | `describe('UC-001: …')` with `it('A1: …')` and `it('BR-003: …')`; Playwright `test.describe('UC-001: …')` with `{ tag: '@UC-001' }`                                                                                   | `test.describe('TC-001: …')` with `{ tag: '@TC-001' }` and `test.step('Step <n>: …')`                       |

Inside a test that carries its use case id, a rule is named by its bare id (`businessRules = {"BR-003"}`,
`it('BR-003: …')`), because the use case qualifies it.

### Reading the chain

- **Specifications:** `spec_lint.py --trace` (skill `/spec-review`) prints the matrix requirement → use case → business
  rules → test cases, and test case → process → use cases, from `docs/` alone. `--only FR-014` answers "why does
  this exist, and what realizes it" for one id.
- **Code and tests:** `/coverage-check UC-XXX` (in `aiup-vaadin-jooq` and `aiup-angular-jpa`) maps every step, flow,
  rule, and linked NFR and constraint of a use case onto the code and the tests that realize it, using the markers
  above first. In the other stacks, searching for the markers gives the same answer by hand.

### Requirement status

The use case carries the progress; a requirement's status follows it. Deferred and Rejected are scope decisions and
are kept by hand in `requirements.md`. Open, In Progress, Implemented, and Verified are derived from the `**Status:**`
of the use cases that list the requirement in their `**Requirements:**` line: Verified when every one is Tested or
Done, Implemented when every one is at least Implemented, In Progress when some are, and Open otherwise. Obsolete use
cases do not count.

`spec_lint.py --trace` shows the derived status next to the stored one, the lint warns with `REQ_STATUS_DRIFT` when they
differ, and `/requirements` sets the stored value when it updates the catalog. A use case moves by
`/coverage-check`; its requirements follow.

### Construction inputs

The use case is the traceability hub for construction. Every implementation skill of every stack plugin reads the
same inputs:

| Input                                   | Rule                                                                              |
|-----------------------------------------|-----------------------------------------------------------------------------------|
| `docs/use_cases/UC-XXX-*.md`            | Required.                                                                         |
| `FR-*`, `NFR-*`, `C-*` rows             | Only the ids on the use case's `**Requirements:**` line, never the whole catalog. |
| `docs/entity_model.md`                  | Required.                                                                         |
| `docs/glossary.md`                      | When present: names in code follow its terms, never its Avoid synonyms.           |
| Architecture decisions (`docs/**/adr/`) | When present: followed like existing conventions.                                 |

An implementation agent therefore sees every NFR and constraint that applies to its use case without reading the rest
of the catalog. That only works when the `**Requirements:**` line is complete: a missing or unresolved line is
reported and handed to `/spec-review`, never guessed, and `/spec-review` flags NFRs and constraints a use case should
reference but does not. The coverage audit treats each linked NFR and constraint as a coverage unit.

## Specification review

The identifiers are also what makes the specifications checkable against each other. `/spec-review` in `aiup-core`
does that in two parts:

- **Lint (deterministic).** The bundled `spec_lint.py` (Python standard library only) reports what is certain: every
  use case of `use_cases.puml` has a specification and every specification is in the diagram, ids are unique, every
  `FR-XXX`, `UC-xxx BR-yyy`, use case, and process reference resolves, every functional requirement is covered,
  every BPMN activity maps to a use case, every requirement status matches its use cases, the same rule text is not
  copied between use cases, and no weak word or glossary synonym is used. It also runs the per-file checks of `validate_use_case.py`. Errors fail a CI build.
- **Review (advisory).** The agent adds findings that need judgment: contradicting or reworded business rules, UI or
  technical detail in a use case, steps that can fail without an alternative flow, a scenario that does not reach its
  goal, untestable rules, ambiguity, wrong or missing actors, NFRs and constraints a use case does not reference, and
  data that does not match the entity model. These are warnings for a pull request comment and never fail a build.

In an existing project, the first lint run typically reports many findings. `spec_lint.py --update-baseline` accepts
them into `docs/.spec-lint-baseline.json`, so only new findings fail the build; entries that stop matching are
reported and can be removed.

`/spec-review` checks specifications against specifications. Whether code and tests realize a specification is the
coverage check below.

## Coverage check

Traceability is only worth as much as it is checked. `aiup-vaadin-jooq` and `aiup-angular-jpa` ship a read-only
`uc-coverage` sub-agent for that check ([Vaadin](../aiup-vaadin-jooq/agents/uc-coverage.md),
[Angular](../aiup-angular-jpa/agents/uc-coverage.md)): it turns a use case specification
into a list of coverage units — every main success scenario step, alternative flow, business rule, precondition,
postcondition, and linked NFR and constraint — and maps each one onto the code and the tests that realize it.

It reports gaps (a unit with no code or no test), drift (code or tests the specification no longer describes), and the
specification's justified next `**Status:**` value. It never edits a file; the agent that called it closes the gaps.

Those plugins' implementation and testing skills do not run the audit themselves — each run re-reads the
specification and the code base and takes minutes, so the check runs once, explicitly, when you ask for it. The
[`/coverage-check`](../aiup-vaadin-jooq/skills/coverage-check/SKILL.md) skill is that entry point, and the only one
that judges both sides in a single matrix:

```text
/coverage-check UC-001                 # implementation and tests together
/coverage-check UC-001 tests           # narrow the audit to one side
/coverage-check TC-001                 # a journey audits its Flow rows and Validation items
```

A use case whose coverage matrix is complete in both columns is the point at which `**Status:** Tested` is justified.
That is what `/coverage-check UC-001` is for; the skill reports the justified status but leaves the line to you.

Each agent's marker table is specific to its stack's conventions. `aiup-blazor-dotnet` and `aiup-nestjs-nextjs` do not
ship an equivalent yet; the same check can be run by hand from
[the agent definition](../aiup-vaadin-jooq/agents/uc-coverage.md) with the markers of the stack in question.

## Core skills

| Skill                                                                | Result                                                          |
|----------------------------------------------------------------------|-----------------------------------------------------------------|
| [`/requirements`](../aiup-core/skills/requirements/SKILL.md)         | Requirements catalog derived from `docs/vision.md`              |
| [`/entity-model`](../aiup-core/skills/entity-model/SKILL.md)         | Mermaid entity model and attribute definitions                  |
| [`/use-case-diagram`](../aiup-core/skills/use-case-diagram/SKILL.md) | PlantUML diagram of actors and use cases                        |
| [`/use-case-spec`](../aiup-core/skills/use-case-spec/SKILL.md)       | One detailed specification per use case                         |
| [`/test-case`](../aiup-core/skills/test-case/SKILL.md)               | Executable user journey across specified use cases              |
| [`/spec-review`](../aiup-core/skills/spec-review/SKILL.md)           | Lint and advisory review of specifications against each other   |
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
