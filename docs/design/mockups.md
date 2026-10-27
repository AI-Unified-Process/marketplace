<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Mockups

A use case says what happens, not how the screen looks, so the UI layer skills guessed the layout, the field order,
and the grid columns, and the result often differed from what the team had designed (#48). A use case can now link
its mockups or wireframes on an optional `**Mockup:**` line.

- **One optional line, several links.** `**Mockup:**` sits in the Overview after `**Layers:**` and holds Markdown
  links to a Figma file, an image, or a Markdown sketch under `docs/`. A use case
  with a list view and an edit dialog names both, so the line takes comma-separated Markdown links, not one. A
  section of its own was rejected as heavier than the information needs. The label is `**Mockup:**` in German too,
  because `Entwurf` is a status value.
- **Optional, and never reported when missing.** Many use cases have no screen, or a team that designs in the code.
  `/use-case-spec` keeps an existing line and adds one only when the user names a mockup; it never asks. The
  semantic review does not count a missing mockup as incomplete.
- **Only the UI layer reads it.** The rule lives once, in section "Mockups" of `/use-case-implement`; `/vaadin-flow-ui`,
  `/hilla-ui`, and `/angular-ui` refer to it and report a `Mockup:` line in their Handover. The test skills do not
  read it: their oracle is the specification and the labels the UI Handover names, and a test derived from a picture
  would test the picture. The combined stack plugins keep their own `/implement` rules.
- **The specification wins.** The mockup decides the layout — where fields, columns, and actions sit, and a label
  the specification does not give. The specification decides which fields and actions exist, the rules, and every
  message. A mockup element without backing in the use case or the entity model is not built; a mockup text that
  contradicts a specification message is replaced by it. Each disagreement is an open question, `Blocking: No`,
  raised by the UI layer skill, because the UI already follows the specification and only the layout is in question.
  Stopping to ask was rejected: a stale mockup is common and would stop every UI layer run.
- **Figma through its MCP server.** Images and sketches are read as files. A Figma link needs the Figma MCP server;
  without it the skill says so and builds from the specification, rather than guessing what the design shows.
- **The lint checks only what is exact.** `validate_use_case.py` warns `MOCKUP_NO_LINK` for a line that links
  nothing, and `spec_lint.py` warns `MOCKUP_MISSING_FILE` for a relative link to a file that does not exist. URLs are
  not fetched: the lint never goes online, and a Figma file needs credentials.
