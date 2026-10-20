<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of spring-rest

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`). Copy them exactly; the generic business
rule row (`All`) belongs to `/stack` and is not repeated here.

| Layer | Skill       | Kind | Marker to grep for                                                                                         |
|-------|-------------|------|------------------------------------------------------------------------------------------------------------|
| API   | spring-rest | Code | `UC-XXX` in the Javadoc of the `@RestController` handler method that realizes a step or an alternative flow |
| API   | spring-rest | Code | `// UC-XXX BR-YYY:` directly above a request DTO constraint that repeats a rule the service enforces        |
| API   | spring-rest | Name | `<Entity>Controller` classes annotated `@RestController`; `<Entity>Request` / `<Entity>Response` records     |
