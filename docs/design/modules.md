<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Modules in the diagrams

`/reverse-engineer` splits the use case diagram and the entity model by module when a project has more than about
12 use cases or 15 entities and the code shows at least two modules (build modules, feature packages, database
schemas, or foreign key clusters). Each module gets **a folder or file of its own**, so a team reviews its part
without scrolling through the others: `docs/use_cases.puml` keeps only the `@startuml Modules` overview (actors and
`package`s, no use cases), and each module has `docs/use_cases/<slug>/` with its `use_cases.puml` and the
specifications of its use cases; `docs/entity_model.md` keeps only the `## Modules` table, and each module has
`docs/entity_model/<slug>.md` in the normal entity model format. The slug (module name in kebab-case) is the
`package` alias, the folder, and the file name. The two entry files stay at their paths, and every reader finds a
specification with the recursive glob `docs/use_cases/**/UC-XXX-*.md` — a change to how specifications are located
is made in all readers (skills, the coverage agents, `spec_lint.py`) together, as defined in `docs/workflow.md`.
An earlier design kept the split inside the two fixed files as `@startuml` blocks and `## Module:` sections; it was
dropped because one file per system stays unreadable at that size. `spec_lint.py` checks the layout
(`MODULE_UNKNOWN`, `MODULE_MISMATCH`, `DUPLICATE_ID` across module files). `/use-case-diagram`, `/use-case-spec`,
and `/entity-model` keep an existing split and place new use cases and entities in it, but never introduce one; the
`MODULAR` fixture of `spec_lint.py --self-test` holds the format.
