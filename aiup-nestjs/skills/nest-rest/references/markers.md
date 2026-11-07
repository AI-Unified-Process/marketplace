<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of nest-rest

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`), exactly as they appear there.

| Layer | Skill     | Kind | Marker to grep for                                                                                    |
|-------|-----------|------|-------------------------------------------------------------------------------------------------------|
| API   | nest-rest | Code | `UC-XXX` in the TSDoc of the `@Controller()` handler method that realizes a step or an alternative flow |
| API   | nest-rest | Code | `// UC-XXX BR-YYY:` directly above a class-validator decorator of a request DTO that repeats a rule the service enforces, for a rule whose rejection the specification does not word |
| API   | nest-rest | Name | `<feature>.controller.ts` with the class `<Feature>Controller`; `dto/*.ts` with `<Entity>Response` types and request DTO classes |
