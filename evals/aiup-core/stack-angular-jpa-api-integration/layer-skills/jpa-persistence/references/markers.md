<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of jpa-persistence

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`). Copy them exactly; the generic business
rule row (`All`) belongs to `/stack` and is not repeated here.

| Layer       | Skill           | Kind | Marker to grep for                                                                                                                       |
|-------------|-----------------|------|------------------------------------------------------------------------------------------------------------------------------------------|
| Persistence | jpa-persistence | Code | `// UC-XXX BR-YYY:` directly above the repository query method, `exists…`/`count…` check, or `@Version` field that enforces the rule |
| Persistence | jpa-persistence | Name | `@Entity` class named after the entity model (`<Entity>`, or `<Entity>Entity` in a hexagonal adapter); Spring Data repository `<Entity>Repository` or `<Entity>JpaRepository`; adapter `<Entity>RepositoryImpl` implementing the outbound port |
