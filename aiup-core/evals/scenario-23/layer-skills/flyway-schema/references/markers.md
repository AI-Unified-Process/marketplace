<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of flyway-schema

The rows this skill keeps in the Markers table of the Development View (`docs/architecture/development.md`), exactly as they appear there. Replace
`<location>` with the migration directory from the Location column of the Migration row.

| Layer     | Skill         | Kind | Marker to grep for                                                                                                    |
|-----------|---------------|------|-----------------------------------------------------------------------------------------------------------------------|
| Migration | flyway-schema | Code | `-- UC-XXX BR-YYY:` directly above the `CHECK`, `UNIQUE`, index, or trigger that enforces the rule                    |
| Migration | flyway-schema | Name | `<location>/V*__*.sql`, named after the tables they change, never after a use case — search them by table and column |
