<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of jooq-persistence

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`), exactly as they appear there.

| Layer       | Skill            | Kind | Marker to grep for                                                                                          |
|-------------|------------------|------|-------------------------------------------------------------------------------------------------------------|
| Persistence | jooq-persistence | Code | `// UC-XXX BR-YYY:` directly above the jOOQ `.where(...)`/`.and(...)` condition or query that enforces the rule |
| Persistence | jooq-persistence | Name | `<Aggregate>Repository` (`@Repository` with a `DSLContext`, or the adapter implementing that outbound port in a hexagonal layout), named after the aggregate root, never a use case |
