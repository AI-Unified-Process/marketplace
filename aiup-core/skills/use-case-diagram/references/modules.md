<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Modules

A large project may hold its diagram split by module, as `/reverse-engineer` writes it: `docs/use_cases.puml` holds
only a `@startuml Modules` diagram — the actors and one `package` per module, no use cases — and each module has a
folder `docs/use_cases/<slug>/` with its own `use_cases.puml` (`@startuml <Module>`, the module's use cases) next to
the specifications of those use cases. The slug is the module name in lowercase kebab-case and the `package` alias in
the overview. Keep that structure when you update the diagrams:

- Add a new use case to the diagram of the module it belongs to — the module that owns the data it changes. When no
  module fits or two fit equally, ask the user instead of guessing; a new module gets its own folder with a
  `use_cases.puml` and a `package` in the overview.
- Keep every use case in exactly one module diagram, and declare an actor with the same name and alias in every
  diagram it appears in. In the overview, link an actor to each module it has a use case in, and keep a `..>` arrow
  for every module that uses data or a use case of another; `<<include>>` and `<<extend>>` stay inside one module
  diagram.
- Continue the ids after the highest `UC-XXX` across all module diagrams; existing ids never change when a use case
  moves module. When one moves, move its specification into the new module's folder too.
- Never merge the module diagrams back into one, never put use cases into the overview, and do not introduce a
  module split in a diagram that has none. Splitting is `/reverse-engineer`'s step; for a forward-engineered diagram
  that has outgrown one image, tell the user.
