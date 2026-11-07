<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of drizzle-schema

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`), exactly as they appear there. Replace
`<schema>` with the `schema` path of `drizzle.config.ts` and `<out>` with its `out` path.

| Layer     | Skill          | Kind | Marker to grep for                                                                                                 |
|-----------|----------------|------|--------------------------------------------------------------------------------------------------------------------|
| Migration | drizzle-schema | Code | `// UC-XXX BR-YYY:` in `<schema>`, directly above the `check`, `unique`, or `uniqueIndex` that enforces the rule |
| Migration | drizzle-schema | Name | `<schema>`, one `pgTable` per entity; `<out>/*.sql` are generated and never named after a use case — search them by table and column |
