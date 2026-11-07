<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of drizzle-persistence

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`), exactly as they appear there.

| Layer       | Skill               | Kind | Marker to grep for                                                                                     |
|-------------|---------------------|------|--------------------------------------------------------------------------------------------------------|
| Persistence | drizzle-persistence | Code | `// UC-XXX BR-YYY:` directly above the Drizzle condition (`eq(...)`, `.where(...)`) or query that enforces the rule |
| Persistence | drizzle-persistence | Name | `<feature>.repository.ts` with an `@Injectable` `<Feature>Repository`, named after the aggregate, never a use case |
