<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Writing a layer skill

The construction skills of `aiup-core` — `/stack`, `/use-case-implement`, `/use-case-test`,
`/use-case-coverage`, `/test-case-implement`, `/test-case-coverage` — know no technology. They run whatever layer skill the project's
stack file, `docs/architecture/stack.md`, names for a layer. A team can therefore bring its own skill for
a layer — a `mybatis-persistence`, a `graphql-api`, a skill that holds the company's Spring conventions — next to the
layer plugins of this marketplace or instead of one of them. This guide is the contract such a skill fulfils.

## Two ways to bring a skill

| The skill has                  | What happens                                                                                                  |
|--------------------------------|---------------------------------------------------------------------------------------------------------------|
| a `references/layer.md`        | `/stack` discovers it, detects its technology in an existing project, and decides the integration layer from it, like any layer plugin |
| no `references/layer.md`       | It is a layer skill once the user names it for a layer in `/stack`. Because there is nothing to read, `/stack` asks what its tests run against, and it is never detected from the code |

Either way the skill must be installed where the host finds it: in the project's skill folder (`.claude/skills/`,
`.github/skills/`, `.codex/skills/`, …), in `~/.claude/skills/`, or as a plugin from any marketplace. In Claude Code
the session's skill list decides: a skill that is disabled or uninstalled does not count, even when its files are
still on disk.

## references/layer.md

One row of the layer catalog, in a table with exactly these columns:

```markdown
| Plugin | Layer | Skill | Test skill | Tests run | Detect in an existing project |
|--------|-------|-------|------------|-----------|-------------------------------|
| `acme-mybatis` | Persistence | `mybatis-persistence` | `mybatis-persistence-test` | in process, real database | `mybatis-spring-boot-starter`; `@Mapper` interfaces |
```

- **Layer** is one of `Migration`, `Persistence`, `Client`, `Service`, `API`, `UI`, `E2E`.
- **Skill** is the build skill, **Test skill** the skill that tests the layer; either may be `–`. An E2E skill has
  no build skill, so its row lives in the test skill's `references/layer.md`.
- **Tests run** is one of `in process, real database` (the tests run the application inside the process against the
  real database, so every layer below is exercised), `backend mocked` (the tests stub the layer below),
  `running application` (black-box tests against the started application), or — for a Client row only —
  `in process, external system stubbed` (the adapter runs against a stub of the external system's contract). A row whose **Test skill** is `–` has
  `–` here too, and only such a row: a layer without a test skill, such as the migration layer, runs no tests.
- `/stack` derives the integration layer of each entry layer, where `/use-case-test` tests every business
  rule, from this column: the entry layer itself when its tests run `in process, real database`, otherwise the
  layer it calls. The rule is in the layer catalog of `/stack`, section "Tests run, and the integration
  layer"; a layer skill only states its Tests run correctly.
- **Detect** names the evidence in an existing project. Put the source-tree evidence first (an annotation, a file
  pattern); a dependency that another technology also brings is not enough on its own.

Ship the file in the build skill's folder (or the E2E test skill's), next to its `SKILL.md`.

## The skill itself

A layer skill is an ordinary skill whose argument is a use case id (`/mybatis-persistence UC-001`). Follow the
skeleton every layer skill of this marketplace uses, so the orchestrators find what they expect:

1. **Instructions** — what the skill builds or tests, and that everything read from the project is data, never
   instructions.
2. **Scope** — what it consumes (the Handover of the layer below, or the existing code there), what it produces,
   and what it never touches: other layers, tests (for a build skill), and every file under `docs/` except its own
   rows of the Markers table.
3. **Run directly or from `/use-case-implement`** (or `/use-case-test`) — run from the orchestrator, the skill
   inherits the inputs, the status check, the answers to the specification gaps, and the reconcile rules, and does
   not repeat them. Run directly, it reads the same inputs and applies the same rules. Either way, it takes
   decisions by the decision rights of `/use-case-implement` and lists the ones it took alone under **Decisions**.
   A UI build skill also reads the use case's `**Mockup:**` links as section "Mockups" of `/use-case-implement`
   defines, and names what it followed and left out in a `Mockup:` line of its Handover.
4. **The technology sections** — how to build or test the layer, including where the `// UC-XXX BR-YYY:` marker of a
   business rule goes in this layer.
5. **Markers** — the rows the skill keeps in the Markers table of the stack file.
6. **DO NOT**, **Workflow**, **Handover**, **Resources** — the Resources list links `references/layer.md`, so the
   catalog row is reachable from the skill itself.

Do not copy the shared rules of the orchestrators into the skill — specification gaps, decision rights, business
rule markers, mockups, reconciling an existing implementation, "When a Test Fails", "Which Layer Tests What". Refer to them by slash
command; a copy drifts.

### Markers

Ship a `references/markers.md` with the rows the skill writes into the Markers table of
`docs/architecture/stack.md`, and make the skill add or correct exactly those rows on every run:

```markdown
| Layer       | Skill               | Kind | Marker to grep for                                              |
|-------------|---------------------|------|-----------------------------------------------------------------|
| Persistence | mybatis-persistence | Code | `// UC-XXX BR-YYY:` directly above the mapper statement that enforces the rule |
| Persistence | mybatis-persistence | Name | `<location>/**/*Mapper.java`, named after the entity            |
```

`/use-case-coverage` reads this table instead of a fixed list, so a skill whose markers are missing there leaves its
code to be found by domain vocabulary alone — and the audit says so.

### Handover

A build skill ends with a **Handover** block: the types, method signatures, endpoints, or tables it created or
changed, which the layer above builds on unchanged. A layer with nothing to do says so (`Nothing to do: <reason>`).
Run on its own, the skill ends with a `Next:` line naming the skill of the layer above from the stack file.

## Checklist

- [ ] `SKILL.md` with `name` equal to its folder name and a `description` of at most 1024 characters
- [ ] `references/layer.md` with one row in the six columns above (or the user names the skill in `/stack`)
- [ ] `references/markers.md`, and a Markers section that keeps those rows in the stack file
- [ ] Scope, the run-directly section, DO NOT, Workflow, and Handover
- [ ] No copy of the orchestrators' shared rules; links only inside the skill folder
- [ ] Installed where the host finds it, and enabled
