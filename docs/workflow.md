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
Inception        Elaboration                                Construction                                        Transition
─────────────    ───────────────────────────────────────    ─────────────────────────────────────────────    ──────────────────────
/requirements →  /entity-model → /use-case-diagram       →  /use-case-spec → implement → test → coverage  →  /acceptance-protocol
                                 ↘ /business-process        /test-case     → automate the journey            /user-guide
                                   (optional)                                                                /release-notes
                 /spec-review at any point, /next names the next step
```

`aiup-core` owns the stack-independent steps. Construction comes in two forms:

- **Combined stack plugin** (`aiup-vaadin-jooq`, `aiup-angular-jpa`, `aiup-blazor-dotnet`, `aiup-nestjs-nextjs`): one
  plugin owns migrations, implementation, and tests for a fixed combination of UI, backend, and data access.
- **Layer plugins** (`aiup-flyway`, `aiup-jooq`, `aiup-jpa`, `aiup-spring-boot`, `aiup-vaadin`, `aiup-angular`,
  `aiup-playwright`): one plugin per technology, combined per project. `/stack` records the combination in
  `docs/architecture/stack.md`; `/use-case-implement`, `/use-case-test`, and `/use-case-coverage` in `aiup-core` run the layer skills it
  names (`/test-case-implement` and `/test-case-coverage` the E2E layer of a journey) — `/use-case-implement` bottom-up (migration, persistence, client, service, API, UI), `/use-case-test` from the integration
  layer up: from the entry layer the use case is offered through, the first layer whose tests run in process
  against the real database (the Browserless tests of a Vaadin Flow UI, the API tests of a REST service), so the layers below it need no tests of their own.
  `/stack` derives it once per entry layer and records it in the Integration layer table; an API next to a
  Vaadin Flow or Hilla UI serves other clients, is the integration layer only of the use cases offered through it
  alone, and gets contract tests of its own for the use cases it offers next to the UI. A REST service without a UI uses the same skills
  without the UI layer. The `**E2E scope:**` line under the Integration layer table says whether `/use-case-test`
  adds a browser test per use case (`Use cases and test cases`, the default) or leaves browser tests to the TC-*
  journeys (`Test cases only`). An external system a use case calls as a secondary actor is listed under
  `## External systems` in the stack file with its contract (OpenAPI or AsyncAPI); the Client layer builds a port and
  an adapter for it, and no test reaches it: the client tests run against a stub of the contract, the other layers
  against a fake of the port.

The layer plugins replace `aiup-vaadin-jooq` and `aiup-angular-jpa`, which are deprecated. Use one form per project:
the combined plugins do not read `docs/architecture/stack.md`. The boundary between `aiup-core` and construction is the set
of files under `docs/`, not a specific coding agent.

## Artifact flow

| Artifact                           | Produced by                              | Consumed by                                                                                                  |
|------------------------------------|------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| `docs/vision.md`                   | Product team                             | `/requirements`                                                                                              |
| `docs/requirements.md`             | `/requirements`                          | Specifications; construction reads the linked rows                                                           |
| `docs/glossary.md`                 | `/requirements`                          | Specifications, implementations, `/spec-review`                                                              |
| `docs/entity_model.md`             | `/entity-model`                          | Migrations and implementations                                                                               |
| `docs/use_cases.puml`              | `/use-case-diagram`                      | `/use-case-spec`, `/business-process`, reviewers                                                             |
| `docs/use_cases/UC-*.md`           | `/use-case-spec`                         | Implementations and use case tests                                                                           |
| `docs/processes/BP-*.bpmn`         | `/business-process` or business analysts | `/test-case` (one test case per path)                                                                        |
| `docs/test_cases/TC-*.md`          | `/test-case`                             | End-to-end journey tests, `/test-case-implement`, `/test-case-coverage`                                      |
| `docs/architecture/stack.md`       | `/stack`; layer skills (Markers)         | `/use-case-implement`, `/use-case-test`, `/use-case-coverage`, `/test-case-implement`, `/test-case-coverage` |
| `docs/open-questions.md`           | `/open-questions`, skills, people        | `/use-case-spec`, `/requirements`, `/entity-model` resolve them; `/spec-review`, coverage audits             |
| `docs/architecture/decisions/ADR-*.md` | `/architecture-decision`, the team       | `/stack`, `/use-case-implement`, and the layer skills follow the `Accepted` ones; `/spec-review`             |
| `docs/architecture/decision-rights.md` | The team; `/stack` creates it on request | `/use-case-implement`, `/use-case-test`, and the layer skills; optional, the defaults apply without it   |
| `docs/user_guide/*.md`             | `/user-guide`; the team adds sections    | The people who use the system                                                                                |
| `docs/acceptance/<round>.md`       | `/acceptance-protocol`; testers fill in the results | `/acceptance-protocol close`, which sets accepted use cases to `Done`                             |
| `docs/release-notes.md`            | `/release-notes`                         | The people who use the system                                                                                |

For a large project, `/reverse-engineer` splits both diagrams by module, one folder or file per module:

```text
docs/
├── use_cases.puml             # @startuml Modules: actors and one package per module, no use cases
├── use_cases/
│   ├── billing/
│   │   ├── use_cases.puml     # @startuml Billing: the module's use cases
│   │   └── UC-005-pay-invoice.md
│   └── ordering/
│       ├── use_cases.puml
│       └── UC-001-place-order.md
├── entity_model.md            # ## Modules table, each module linked to its file
└── entity_model/
    ├── billing.md             # the module's ER diagram and entities
    └── ordering.md
```

The module slug — the name in lowercase kebab-case — is the `package` alias in the overview, the folder under
`docs/use_cases/`, and the file under `docs/entity_model/`. Every reader finds a specification with the recursive glob
`docs/use_cases/**/UC-XXX-*.md`, reads the module diagrams `docs/use_cases/*/use_cases.puml` next to the overview, and
the module files `docs/entity_model/*.md` the `## Modules` table links. `/use-case-diagram`, `/use-case-spec`, and
`/entity-model` keep the split on update and place new use cases and entities in their module; only
`/reverse-engineer` introduces it.

The stack file, `docs/architecture/stack.md`, is the AI Unified Process record of the technical layers: which layer
skill builds and tests each layer, the integration layer, the module layout, the API contract, the commands, and
the markers. It does not depend on how the team documents its architecture. arc42, C4, Kruchten's 4+1 views, a
single `docs/architecture.md`, or no architecture documentation at all: the stack file sits next to it and looks
the same. `/stack` reads the team's documents and ADRs as input and never writes them; the construction skills
read only the stack file.

Every artifact is a review point. Correcting an intermediate document is expected and is safer than compensating for
an incorrect assumption in generated code.
`/use-case-spec` asks first: before it writes a use case, it asks up to five questions whose answers change the
specification and have no reasonable default, writes the answers into the steps and rules, and reports every default
it chose without asking as an assumption. `/requirements` and `/entity-model` do the same for the catalog (roles,
scope, quality thresholds, conflicts) and for the entity model (cardinality, optionality, identity, cross-attribute
rules).
The `/implement` and `/use-case-implement` skills act on this: they ask before implementing a use case that is not yet `Approved`, and they
record each gap in the specification as an open question in `docs/open-questions.md` — naming the step, flow, or
rule — instead of closing it with an assumption. The answer goes into the specification through `/use-case-spec`,
not into the code alone. The defaults the clarifying skills choose without asking are recorded there too, so a
product owner confirms or corrects them later (see [Open questions](#open-questions)).

## Traceability

This section is the traceability convention of the AI Unified Process: every skill of every plugin writes and reads
the identifiers and markers defined here. Stable identifiers preserve two chains:

```text
Requirements catalog         Specification                              Construction
FR-* / NFR-* / C-*   ──→   UC-XXX  ──→  UC-XXX BR-YYY   ──→   implementation  ──→  use case tests
                              ↑
BP-XXX process  ──→  path  ──→  TC-XXX (chains several use cases)  ─────────────→  journey test
```

The chain starts at the requirements catalog. Requirements engineering is the first discipline that produces
traceable requirements (in German-speaking projects often the *Lastenheft*); a vision document, when there is one,
is prose without identifiers and is not linked. Test cases are not derived from business rules but from business
processes: one test case per path through a BPMN process model.

### Identifiers

| Id        | Artifact                                                                                | Unique within | Cited elsewhere as |
|-----------|-----------------------------------------------------------------------------------------|---------------|--------------------|
| `FR-XXX`  | Functional requirement, `docs/requirements.md`                                          | Catalog       | `FR-XXX`           |
| `NFR-XXX` | Non-functional requirement, `docs/requirements.md`                                      | Catalog       | `NFR-XXX`          |
| `C-XXX`   | Constraint, `docs/requirements.md`                                                      | Catalog       | `C-XXX`            |
| `UC-XXX`  | Use case, `docs/use_cases/**/UC-XXX-*.md` and the diagram                                  | Project       | `UC-XXX`           |
| `BR-YYY`  | Business rule, `### BR-YYY:` inside one use case                                        | Its use case  | `UC-XXX BR-YYY`    |
| `A<n>`    | Alternative flow, `### A<n>:` inside one use case                                       | Its use case  | `UC-XXX A<n>`      |
| `TC-XXX`  | Test case, `docs/test_cases/TC-XXX-*.md`                                                | Project       | `TC-XXX`           |
| `BP-XXX`  | Business process, `docs/processes/BP-XXX-*.bpmn`; also the `id` of its `<bpmn:process>` | Project       | `BP-XXX`           |
| `OQ-XXX`  | Open question, `## OQ-XXX:` section of `docs/open-questions.md`                         | Project       | `OQ-XXX`           |
| `ADR-XXX` | Architecture decision record, `docs/architecture/decisions/ADR-XXX-*.md`                | Project       | `ADR-XXX`          |

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
| Test case     | Process                            | The `**Process:**` line: `BP-XXX` linked to the `.bpmn` file, and the path    |
| BPMN activity | Use case                           | The use case id in the activity name, or the same name as the use case title  |
| Code          | Use case, rule                     | The implementation marker below                                               |
| Test          | Use case or test case, flow, rules | The test markers below                                                        |
| Open question | One element of the specification   | The `**Element:**` line; `**Resolved in:**` names where the answer went       |

### Markers in code

**Implementation.** Every stack marks the code that enforces a business rule with a comment in the qualified form,
directly above the method, query condition, or validator that enforces it:

```java
// UC-005 BR-003: A guest must be at least eighteen years old on the day of arrival.
```

The marker names the rule and restates it in one line; it is the place a reader or `/coverage-check` finds the rule
in the code. It is optional in the sense that a missing marker is a traceability gap, not missing behavior: code
written before the convention still counts when its domain vocabulary matches. The implementation skills add it for
every rule they implement. In the combined stack plugins the use case id itself needs no separate marker in
production code: Blazor feature folders carry it (`Features/UC001_<Feature>/`), the other stacks name views,
services, and handlers after the use case's domain, and the tests carry the id. The layer plugins do mark it, because
a layered use case spreads over classes named after entities: `UC-XXX` in the Javadoc of the service method
(`/spring-service`), the REST handler method (`/spring-rest`), and the port method of an external system
(`/spring-client`), in the class Javadoc of a Vaadin Flow view
(`/** UC-XXX <Use Case Name>. */`) and a Hilla endpoint, in the file comment of a Hilla view, and as
`/** UC-XXX: <Use Case Name> */` above an Angular page component.

**Tests.** Each stack carries the ids in the form its test framework supports. The Layer plugins row summarizes the
layer test skills; in a layered project the Markers table of `docs/architecture/stack.md` is authoritative:

| Stack                | Use case tests (`UC-*`)                                                                                                                                                                                                                                                                                                                                                                            | Journey tests (`TC-*`)                                                                                      |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| `aiup-vaadin-jooq`   | `@UseCase(id = "UC-001", scenario = "A1: …", businessRules = {"BR-003"})` in `UC001<Name>Test` and `UC001<Name>ServiceTest`; `describe('UC-001: …')` in `UC-001-<slug>.test.tsx` (Hilla); Playwright `UC001<Name>IT`                                                                                                                                                                               | `TC001<Name>IT` with `@DisplayName("TC-001: …")` and `// Step <n>: <name>` per Flow row                     |
| `aiup-angular-jpa`   | `@UseCase(id = "UC-001", scenario = "A1: …", businessRules = {"BR-003"})` in `UC001<Name>Test`; `describe('UC-001: …')` in `UC-001-<slug>.spec.ts`; Playwright `test.describe('UC-001: …')` with `{ tag: '@UC-001' }`                                                                                                                                                                              | `TC-001-<slug>.spec.ts` with `test.describe('TC-001: …')`, `{ tag: '@TC-001' }`, `test.step('Step <n>: …')` |
| `aiup-blazor-dotnet` | `[UseCase("UC-001", Scenario = "A1: …", BusinessRules = ["BR-003"])]` in `UC001<Name>Test`, `UC001<Name>HandlerTest`, and `UC001<Name>IT`                                                                                                                                                                                                                                                          | `TC001<Name>IT` with `[Fact(DisplayName = "TC-001: …")]` and `// Step <n>: <name>` per Flow row             |
| `aiup-nestjs-nextjs` | `describe('UC-001: …')` with `it('A1: …')` and `it('BR-003: …')`; Playwright `test.describe('UC-001: …')` with `{ tag: '@UC-001' }`                                                                                                                                                                                                                                                                | `test.describe('TC-001: …')` with `{ tag: '@TC-001' }` and `test.step('Step <n>: …')`                       |
| Layer plugins        | `@UseCase(id = "UC-001", scenario = "A1: …", businessRules = {"BR-003"}, requirements = {"NFR-002"})` in `UC001<Name>RepositoryTest`, `<System>ClientTest`, `UC001<Name>ServiceTest`, `UC001<Name>ApiTest` (`…ApiIT` live), `UC001<Name>EndpointTest` (Hilla), and `UC001<Name>Test` (Vaadin Flow); `describe('UC-001: …')` in `UC-001-<slug>.test.tsx` (Hilla) or `UC-001-<slug>.spec.ts` (Angular); E2E `UC001<Name>IT`, or `UC-001-<slug>.spec.ts` in the E2E folder with `{ tag: '@UC-001' }` (Playwright) | `TC001<Name>IT` with `@TestCase(id = "TC-001", useCases = {"UC-001", …})` (Vaadin) or `TC-001-<slug>.spec.ts` (Playwright) with `// Step <n>: <name>` per Flow row |

**Layered stacks.** A project that combines layer plugins (`aiup-flyway`, `aiup-jooq`, `aiup-jpa`, `aiup-spring-boot`,
`aiup-vaadin`, `aiup-angular`, `aiup-playwright`) instead of one combined stack plugin records its layers in
`docs/architecture/stack.md`, written by `/stack`. Each layer skill keeps its own rows in the Markers table of that
file, so the markers of a project are always the markers of the layers it actually uses, and `/use-case-coverage` reads
them from there. A use case offered through only some entry points names them in the optional `**Layers:**` line of its
Overview (`UI`, `API`, or `Service` alone); `/use-case-implement` and `/use-case-test` then build and test only those layers, and
`/use-case-coverage` reports no gap for the layers it leaves out. A use case may also link its mockups or wireframes
in the optional `**Mockup:**` line (a Figma link, an image, or a Markdown sketch under `docs/`): the UI layer skills take
the layout from them, and the specification stays authoritative for behaviour, rules, and messages. The mockup is no
traceability link; a use case without one is never reported, and `/spec-review` warns only about a link to a missing
file. A use case offered through the API layer may link the operations of the API contract its client agreed with the
team in the optional `**API:**` line (`[createBooking](../api/booking.yaml#createBooking)`, an OpenAPI `operationId`
or an AsyncAPI channel). In a contract-first project the API layer skills build and test the operation as the
contract says; the specification keeps the flows, rules, and messages, and a disagreement between the two becomes an
open question. `/spec-review` warns when a link does not resolve, never when the line is missing.

Inside a test that carries its use case id, a rule is named by its bare id (`businessRules = {"BR-003"}`,
`it('BR-003: …')`), because the use case qualifies it.
In the layer plugins a test also names the `NFR-*` and `C-*` ids of the use case's `**Requirements:**` line whose
limit it asserts (`requirements = {"NFR-002"}`, `it('NFR-002: …')`); these ids are unique in the catalog and need no
qualifier. An `FR-*` id is never named there, because the use case realizes its FRs as a whole.

### Reading the chain

- **Specifications:** `spec_lint.py --trace` (skill `/spec-review`) prints the matrix requirement → use case → business
  rules → test cases, and test case → process → use cases, from `docs/` alone. `--only FR-014` answers "why does
  this exist, and what realizes it" for one id. Its Requirement Coverage table answers "are all requirements
  covered": active requirements linked to a use case, with every linking use case in a test case, and Verified.
  `/spec-review report` puts the counts, the coverage, the matrix, and the lint findings on one HTML page,
  `docs/spec-report.html`; `/spec-review report FR-014` narrows it to one id.
- **Change impact:** `spec_lint.py --impact FR-014` (skill `/spec-review impact FR-014`) walks the same chain the
  other way, transitively, before a change is made: which use cases link the requirement, cite a changed rule, or
  include or extend a changed use case, which processes, test cases, and ADRs follow, each with the trace that
  explains it, and where the trace has gaps. The skill adds what touches the change without an id link and the
  hand-offs, from `/use-case-spec` to `/use-case-coverage`.
- **Code and tests:** `/coverage-check UC-XXX` (in `aiup-vaadin-jooq` and `aiup-angular-jpa`) maps every step, flow,
  rule, and linked NFR and constraint of a use case onto the code and the tests that realize it, using the markers
  above first. In a layered stack, `/use-case-coverage UC-XXX` in `aiup-core` does the same with the markers of
  `docs/architecture/stack.md`. In the other stacks, searching for the markers gives the same answer by hand.

### Requirement status

The use case carries the progress; a requirement's status follows it. Deferred and Rejected are scope decisions and
are kept by hand in `requirements.md`. Open, In Progress, Implemented, and Verified are derived from the `**Status:**`
of the use cases that list the requirement in their `**Requirements:**` line: Verified when every one is Tested or
Done, Implemented when every one is at least Implemented, In Progress when some are, and Open otherwise. Obsolete use
cases do not count.

`spec_lint.py --trace` shows the derived status next to the stored one, the lint warns with `REQ_STATUS_DRIFT` when they
differ, and `/requirements` sets the stored value when it updates the catalog. A use case moves by
`/coverage-check` (aiup-vaadin-jooq and aiup-angular-jpa) or `/use-case-coverage` (layer plugins); its requirements follow.
It reaches `Done` only through `/acceptance-protocol close` (see [Transition](#transition)).

### Open questions

A gap in the specification is answered in the specification. Until it is, it is a question in
`docs/open-questions.md`, one `## OQ-XXX:` section per question, so it survives the session that found it and a
product owner answers every question in one place. The format is owned by
[`/open-questions`](../aiup-core/skills/open-questions/SKILL.md); people may edit the file by hand in the same form:

```markdown
## OQ-002: Maximum length of the comment field?

**Element:** UC-003 BR-002
**Raised by:** /use-case-test, 2026-10-26
**Blocking:** No
**Status:** Open

BR-002 requires a comment but sets no limit. Readings: (a) 255 characters; (b) unlimited; (c) 2000 characters.
```

- **Element** names one element: `UC-003`, `UC-003 step 4`, `UC-003 A2`, `UC-003 BR-002`, `FR-014`, `NFR-002`, `C-006`,
  `Glossary: <Term>`, or `Entity: <ENTITY>` and `Entity: <ENTITY>.<attribute>`.
- **Status** runs `Open` → `Answered` (a person gave the answer, in `**Answer:**` and `**Answered by:**`) →
  `Resolved` (the answer is in the specification; `**Resolved in:**` names where). `Withdrawn`, with a
  `**Withdrawn:**` reason, ends a question that no longer applies. Resolved and withdrawn questions stay as history.
- A default chosen without asking stays `Open` with an `**Assumed:**` line; answering it confirms or corrects it.
- Only the skill that changes the specification resolves a question: `/use-case-spec` for use case elements,
  `/requirements` for requirements and glossary terms, `/entity-model` for entities. Construction and test skills
  only append new sections; `/spec-review` and the coverage audits only read the file.
- A **blocking** question that is `Open` or `Answered` blocks the use case its element names, and every use case that
  links the requirement it names. `spec_lint.py` warns on such a use case at `Approved` or `Implemented` and fails at
  `Tested` or `Done` (`OQ_BLOCKING`); the coverage audit does not suggest `Tested`; `/use-case-implement` asks before
  it goes ahead and, when no one can answer, leaves out the elements the question is about.
- Nobody creates the file ahead of time; a missing file means there are no open questions. Questions about scope,
  priority, or budget belong in the team's issue tracker.

### Architecture decisions

An architecture decision is justified by a quality the system must have or a constraint it must respect, so every
architecture decision record links at least one `NFR-` or `C-` of `docs/requirements.md` in its `**Requirements:**`
line. When the NFR or the constraint changes, the ADRs that link it are the ones to revisit. They live in
`docs/architecture/decisions/`; an existing `adr/` or `adrs/` folder anywhere in `docs/` is read as well. The format
is owned by [`/architecture-decision`](../aiup-core/skills/architecture-decision/SKILL.md); teams keep their own ADR
format and add the lines:

```markdown
# ADR-008: HttpOnly cookies for the session

**Status:** Accepted
**Date:** 2026-10-26
**Requirements:** NFR-004, C-005
**Supersedes:** ADR-002
```

- **Status** runs `Proposed` → `Accepted`, and from there to `Superseded` (by the ADR named in `**Superseded by:**`)
  or `Deprecated`; a proposal the team decides against is `Rejected`. Construction follows only `Accepted` ADRs.
- A decision whose quality or constraint is not in the requirements yet goes to `/requirements` first; an FR alone is
  no reason for an architecture decision.
- No other skill writes an ADR. `/stack` names the choices of its question round that no constraint or ADR fixed,
  `/use-case-implement` names an answered architecture question (a new dependency, a deviation from an ADR), and
  `/requirements` names the ADRs linking an NFR or constraint it changed — each with `/architecture-decision` as the
  next step.
- `spec_lint.py` reports an ADR link to nothing as `DANGLING_REF`, and `ADR_UNLINKED`, `ADR_STALE`, and `ADR_INVALID`
  as warnings: the ADRs are the team's documents, so a brownfield ADR without the line never fails a build.

### Construction inputs

The use case is the traceability hub for construction. Every implementation skill of every stack plugin, and
`/use-case-implement` in a layered stack, reads the same inputs:

| Input                                   | Rule                                                                              |
|-----------------------------------------|-----------------------------------------------------------------------------------|
| `docs/use_cases/UC-XXX-*.md`            | Required.                                                                         |
| `FR-*`, `NFR-*`, `C-*` rows             | Only the ids on the use case's `**Requirements:**` line, never the whole catalog. |
| `docs/entity_model.md`                  | Required.                                                                         |
| `docs/glossary.md`                      | When present: names in code follow its terms, never its Avoid synonyms.           |
| Architecture decisions (`decisions/`)   | When present: the `Accepted` ones are followed like existing conventions.         |
| `docs/architecture/stack.md`            | Layered stacks only: the layer skills to run, the module layout, the API contract. |
| `docs/architecture/decision-rights.md`  | Layered stacks, when present: replaces the default decision rights (see below).   |

An implementation agent therefore sees every NFR and constraint that applies to its use case without reading the rest
of the catalog. That only works when the `**Requirements:**` line is complete: a missing or unresolved line is
reported and handed to `/spec-review`, never guessed, and `/spec-review` flags NFRs and constraints a use case should
reference but does not. The coverage audit treats each linked NFR and constraint as a coverage unit.

### Decision rights

"No assumptions for specification gaps" needs a line between a gap and an implementation choice. In a layered stack,
`/use-case-implement` draws it in three sections, which its layer skills and `/use-case-test` follow:

- **The agent decides alone** — internal structure and naming within the glossary, UI layout, labels and column
  order within the project's conventions, endpoint paths and DTO shapes within the API contract (never for an operation the use case's `**API:**` line
  links), test data and the
  structure of the tests. The report lists these choices under **Decisions**, so a reviewer checks them quickly.
- **The agent asks first** — gaps, ambiguity, and contradictions in the specification; validation values, limits,
  defaults, and user-visible messages with business meaning that it does not state; changes to the data model beyond
  the entity model; a deviation from a constraint or the Rationale of a requirement (each recorded in
  `docs/open-questions.md`); and a new library or dependency or a deviation from an accepted ADR, which have no
  element of the specification and are asked and reported only.
- **The agent never** changes a specification, requirement, ADR, or the glossary on its own, changes an existing test
  to make it pass, or sets a status line.

A team tightens or loosens the first two sections in `docs/architecture/decision-rights.md` (`/stack` offers to
create it from the defaults); the "never" rules always apply, and a decision no rule names is asked first.

## Specification review

The identifiers are also what makes the specifications checkable against each other. `/spec-review` in `aiup-core`
does that in two parts:

- **Lint (deterministic).** The bundled `spec_lint.py` (Python standard library only) reports what is certain: every
  use case of `use_cases.puml` has a specification and every specification is in the diagram, ids are unique, every
  `FR-XXX`, `UC-xxx BR-yyy`, use case, and process reference resolves, every functional requirement is covered,
  every BPMN activity maps to a use case, every requirement status matches its use cases, the same rule text is not
  copied between use cases, no weak word or glossary synonym is used, and every open question is well-formed, points
  to an element, and no blocking one is left on a use case that claims to be tested. It also runs the per-file checks of `validate_use_case.py`. Errors fail a CI build.
- **Review (advisory).** The agent adds findings that need judgment: contradicting or reworded business rules, UI or
  technical detail in a use case, steps that can fail without an alternative flow, a scenario that does not reach its
  goal, untestable rules, ambiguity, wrong or missing actors, NFRs and constraints a use case does not reference, and
  data that does not match the entity model. These are warnings for a pull request comment and never fail a build.

In an existing project, the first lint run typically reports many findings. `spec_lint.py --update-baseline` accepts
them into `docs/.spec-lint-baseline.json`, so only new findings fail the build; entries that stop matching are
reported and can be removed.

`/spec-review` checks specifications against specifications. Whether code and tests realize a specification is the
coverage check below.

Both checks have an end point, so that a review does not turn into a loop. `/spec-review` ends with **Ready for
Approved**: yes once the lint passes, no semantic warning is open, and no blocking open question is left; `info` findings never block it and are not
turned into fix commands. `/coverage-check` is finished when every unit is `Covered` or `n/a`. A second run in the
same conversation compares with the first and separates real changes from a judgment that merely wobbled, and drift
between code and specification is a decision for you — which side is right — never fixed on one side by guesswork.

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

Each agent's marker table is specific to its stack's conventions. In a layered stack, `/use-case-coverage` and `/test-case-coverage` in
`aiup-core` run the same audit with [its own agent](../aiup-core/agents/uc-coverage-layered.md), which reads the markers from
`docs/architecture/stack.md` instead of a fixed table. `aiup-blazor-dotnet` and `aiup-nestjs-nextjs` do not ship an
equivalent yet; the same check can be run by hand from [the agent definition](../aiup-vaadin-jooq/agents/uc-coverage.md)
with the markers of the stack in question.

## Transition

Transition hands the system to the people who use it. Its three skills read the specifications and write documents
for those people; none of them changes a specification, except that closing an acceptance round sets `Done`.

```text
/acceptance-protocol release-1.4                     # checklist per TC-* (and per uncovered UC-*) at Tested
/acceptance-protocol record release-1.4 TC-002 "steps 1-5 pass" P. Meier
/acceptance-protocol close release-1.4               # proposes Done; sets it after you confirm
/user-guide                                          # docs/user_guide/, one chapter per actor
/release-notes 1.4.0 since v1.3.0                    # use cases that reached Done since the tag
```

- **Acceptance.** `/acceptance-protocol` writes `docs/acceptance/<round>.md` with one checklist per test case — a row
  per Flow row and validation — and one per use case that no test case covers, each row with Result (`Pass`,
  `Fail`, `Blocked`), Tester, Date, and Remark. Testers fill it in by hand or report to the skill. `close` proposes
  `Done` for every use case at `Tested` whose rows all passed and that no blocking open question holds, and sets it
  after you confirm. For a failed row it names both fixes — the code (`/use-case-implement`, `/use-case-test`) or the
  specification (`/use-case-spec`) — and leaves the choice to you.
- **User guide.** `/user-guide` writes `docs/user_guide/` from the use cases at `Tested` or `Done`: one chapter per
  primary actor (per module in a split project), one task section per use case in the second person and the
  glossary's terms. Each section it writes carries a `<!-- UC-XXX spec=… text=… -->` anchor; sections without one
  are the team's and survive every re-run. The two hashes let a re-run leave unchanged sections alone, rewrite the
  ones whose use case changed, and ask before overwriting one edited by hand. It never invents screens or labels the
  specification does not name.
- **Release notes.** `/release-notes` compares the use cases at a Git tag with the working tree and adds a version to
  `docs/release-notes.md`: use cases that reached `Done` (new), accepted use cases whose behaviour changed, use cases
  that became `Obsolete` (removed), and requirements whose use cases are all `Done` (delivered). The content comes
  from the specifications, never from commit messages.

## Core skills

| Skill                                                                      | Result                                                                  |
|----------------------------------------------------------------------------|-------------------------------------------------------------------------|
| [`/requirements`](../aiup-core/skills/requirements/SKILL.md)               | Requirements catalog derived from `docs/vision.md`                      |
| [`/entity-model`](../aiup-core/skills/entity-model/SKILL.md)               | Mermaid entity model and attribute definitions                          |
| [`/use-case-diagram`](../aiup-core/skills/use-case-diagram/SKILL.md)       | PlantUML diagram of actors and use cases                                |
| [`/use-case-spec`](../aiup-core/skills/use-case-spec/SKILL.md)             | One detailed specification per use case                                 |
| [`/test-case`](../aiup-core/skills/test-case/SKILL.md)                     | Executable user journey across specified use cases                      |
| [`/spec-review`](../aiup-core/skills/spec-review/SKILL.md)                 | Lint and advisory review of specifications against each other           |
| [`/next`](../aiup-core/skills/next/SKILL.md)                               | The project state and the next command with its reason (read-only)      |
| [`/open-questions`](../aiup-core/skills/open-questions/SKILL.md)           | `docs/open-questions.md`: record, list, answer, and withdraw questions  |
| [`/architecture-decision`](../aiup-core/skills/architecture-decision/SKILL.md) | ADRs linked to the NFRs and constraints they serve                  |
| [`/reverse-engineer`](../aiup-core/skills/reverse-engineer/SKILL.md)       | AI Unified Process baseline recovered from an existing codebase         |
| [`/stack`](../aiup-core/skills/stack/SKILL.md)                             | `docs/architecture/stack.md`: the layer skills of a layered stack       |
| [`/use-case-implement`](../aiup-core/skills/use-case-implement/SKILL.md)   | A use case implemented across all layers of a layered stack             |
| [`/use-case-test`](../aiup-core/skills/use-case-test/SKILL.md)             | The tests of a use case, from the integration layer up                  |
| [`/use-case-coverage`](../aiup-core/skills/use-case-coverage/SKILL.md)     | Coverage matrix of a use case in a layered stack                        |
| [`/test-case-implement`](../aiup-core/skills/test-case-implement/SKILL.md) | The automated end-to-end test of a test case journey in a layered stack |
| [`/test-case-coverage`](../aiup-core/skills/test-case-coverage/SKILL.md)   | Coverage matrix of a test case journey in a layered stack               |
| [`/user-guide`](../aiup-core/skills/user-guide/SKILL.md)                   | `docs/user_guide/`: the user guide from the accepted use cases          |
| [`/acceptance-protocol`](../aiup-core/skills/acceptance-protocol/SKILL.md) | `docs/acceptance/<round>.md`; accepted use cases set to `Done`          |
| [`/release-notes`](../aiup-core/skills/release-notes/SKILL.md)             | `docs/release-notes.md`: what reached `Done` since a Git tag            |

The linked `SKILL.md` files are the authoritative descriptions of inputs, outputs, and behavior.

## Working with changes

When product intent changes:

1. Update `docs/vision.md` or the relevant requirement.
2. Reconcile `docs/requirements.md` and keep existing identifiers stable.
3. Revisit the entity model and use case diagram if the domain or user goals changed.
4. Update affected use case and test case documents.
5. Reconcile migrations, implementation, and tests through the selected stack plugin, or `/use-case-implement` and
   `/use-case-test` in a layered stack.

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
