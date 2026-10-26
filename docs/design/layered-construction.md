<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Layered construction

The design answers "REST API + Spring Boot + jOOQ, no UI": a combined plugin cannot express it, a combination of
layer plugins can. Rules that hold it together:

- **The stack file is the contract, at one path.** It is always `docs/architecture/stack.md`, and no skill reads
  any other file for the layers — one path keeps every reader free of a layout rule. `/stack` writes the Layers
  table (layer → technology → skill → test skill → location), the Integration layer table, module layout, API
  contract, and commands from the template `aiup-core/skills/stack/references/stack.md` (not copyright-stamped; it
  lands in the user's project).
- **The stack file is AIUP's, the architecture documentation is the team's.** The stack file does not depend on
  how a team documents its architecture — arc42, C4, Kruchten's 4+1, a single `docs/architecture.md`, or nothing —
  and looks the same next to each. `/stack` reads those documents and the ADRs (globs `docs/**/{decisions,adr,adrs}/*.md`) as input,
  and never writes, moves, or indexes them. It owns the `## Layers` and `## Markers` sections and writes
  `## Module layout`, `## API contract`, and `## Commands` only when their heading is missing, so a team can refine
  them. aiup-core 3.0.0 made the file the Development View of a 4+1 folder (`docs/architecture/development.md`,
  written by `/architecture`); that tied an AIUP contract to one documentation style and was dropped in 3.1.0.
  `/stack` renames a `development.md` it finds without a `stack.md` and fixes the links to it — the only place that
  still knows the old path; `docs/migration.md` describes the update.
- **Layer plugins describe themselves.** Each build skill, and each E2E test skill, ships `references/layer.md` with
  its catalog row (plugin, layer, skill, test skill, Tests run, Detect); `/stack` discovers installed skills by
  listing `*/references/layer.md` in the project's skill folders (`.claude/skills/`, `.github/skills/`, … — hidden,
  Tessl-symlinked, and gitignored in managed mode, so a default `rg` or a `find` without `-L` misses them), in
  `~/.claude/skills/`, and, for Claude Code marketplace installs, under each `installPath` of
  `~/.claude/plugins/installed_plugins.json` minus plugins disabled in `enabledPlugins` (fallback: the sibling
  plugins in the marketplace cache, newest version). Where the host lists the session's skills, that list decides
  what is installed — the cache also holds uninstalled plugins. So a layer plugin works without a core release.
- **Teams bring their own layer skills.** A skill with a `references/layer.md` is discovered like ours; one without
  it counts when the user names it for a layer, and `/stack` asks for its Tests run. The contract a layer
  skill fulfils is `docs/guides/layer-skill.md`; keep it in step with the layer skill skeleton in `CLAUDE.md`. The Plugins table of
  `references/layer-catalog.md` only names plugins to install; `scripts/check-layer-catalog.sh` keeps it and the
  `layer.md` files in step. A new layer plugin adds a `layer.md` and, when it lives in this marketplace, its row.
- **A use case names its entry layers.** The optional `**Layers:**` line of a use case (German `**Schichten:**`)
  lists `UI`, `API`, or `Service` alone; without it, every entry layer of the project offers the use case. It is
  what makes a Vaadin Flow UI plus a public REST API expressible: `/use-case-implement` builds only the named entry
  layers, `/use-case-test` tests in the topmost in-process layer the use case uses, and the coverage agent reports no
  gap for a layer the line leaves out. The line names entry points, never a technology; `validate_use_case.py` warns
  on any other value.
- **Shared rules live once, in core.** `/use-case-implement` owns inputs, status check, reconcile-existing,
  specification gaps, and the BR marker rule; `/use-case-test` owns "If tests already exist", "When a Test Fails", and
  "Which Layer Tests What". Layer skills and `/test-case-implement` refer to these by slash command and must not copy
  them back; `/test-case-coverage` likewise applies the presentation rules of `/use-case-coverage`.
- **Bottom-up with a Handover.** Layers run migration → persistence → service → API → UI (→ E2E for tests). Each layer
  skill ends with a **Handover** block (types, signatures, endpoints it created) that the next layer builds on.
- **One integration layer per entry point.** Start at the entry layer a use case is offered through: when its test
  skill runs in process against the real database (the catalog's Tests run column: `vaadin-flow-ui-test`,
  `spring-rest-test`, `spring-service-test`, the persistence tests), that is the integration layer; when it mocks the
  backend (`hilla-ui-test`, `angular-ui-test`), it is the layer that entry layer calls. So Flow → UI, Hilla → Service,
  Angular → API, REST → API, Service → Service; an API next to Flow or Hilla never moves the UI's integration layer,
  because the UI does not call it. The rule lives once, in the section "Tests run, and the integration layer" of
  `layer-catalog.md`. Only `/stack` applies it and records the result as the Integration layer table under
  the Layers table — one row per entry layer, in the order UI, API, Service; a use case is tested in the first row
  its `**Layers:**` line names, or the first row without the line. `/use-case-test`, the coverage agent, and the
  layer test skills look the layer up and never derive it; a missing table is a hand-off to `/stack`.
  `/use-case-test` runs the test skills from that layer up and writes no tests of their own for the
  layers below, with three exceptions: a second in-process entry layer the use case is offered through (the API next
  to a Vaadin Flow or Hilla UI) gets its own contract tests by default, even below the integration layer; tests that
  already exist there are reconciled; and units the integration layer's skill reports it cannot reach are tested in
  their own layer. A use case is tested once, there — every business rule with its allowed and rejected case
  included — not once per layer. The coverage agent reads the table so a skipped layer is never a gap, but reports a
  missing contract test of such a second entry layer as one.
- **The E2E scope is the team's decision, recorded once.** With an E2E layer, `/stack` writes the line
  `**E2E scope:** Use cases and test cases` or `Test cases only` under the Integration layer table — asked in its
  question round, or taken from an ADR that decides it. `/use-case-test` runs the E2E test skill for a use case only
  under the first value (a missing line counts as it); the coverage agent then reports a missing use case browser
  test as a gap, under `Test cases only` it does not. TC-* journeys are in scope under either value. The rule lives
  in the section "E2E scope" of `layer-catalog.md`.
- **One `@UseCase` shape.** The Java layer test skills each carry the annotation, since no skill can link another's
  file; `scripts/check-usecase-annotation.sh` fails CI when one of them has no copy or the copies differ. A Java
  journey carries `@TestCase(id, useCases)` on the class, `useCases` being the use cases its Flow table links;
  only `/vaadin-e2e-test` writes it, so its one copy needs no check until a second Java E2E skill exists.
- **Markers come from the project.** Each layer skill ships `references/markers.md` and keeps its own rows in the
  Markers table of `docs/architecture/stack.md` in sync; `agents/uc-coverage-layered.md` reads that table instead of a fixed
  marker list, so core needs no knowledge of any stack's markers and no glob into another plugin.
- **Names never collide with combined stacks.** Core's orchestrators are `use-case-<step>` and `test-case-<step>`
  names, next to `/use-case-spec` and `/test-case`, and layer skills are `<technology>-<layer>[-test]`, so old and
  new plugins can coexist on Tessl (`tessl__<skill>`). The names are final: they stay when the combined stacks are gone.
- **Layer skills run standalone too** (`/jooq-persistence UC-001`), reading the same inputs and implementing one layer.
