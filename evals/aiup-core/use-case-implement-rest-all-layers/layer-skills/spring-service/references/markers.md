<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of spring-service

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`). Copy them exactly; the generic business
rule row (`All`) belongs to `/stack` and is not repeated here.

| Layer   | Skill          | Kind | Marker to grep for                                                                                   |
|---------|----------------|------|------------------------------------------------------------------------------------------------------|
| Service | spring-service | Code | `// UC-XXX BR-YYY:` directly above the service method or guard clause that enforces the rule         |
| Service | spring-service | Code | `UC-XXX` in the Javadoc of the public service method that realizes a step or an alternative flow     |
| Service | spring-service | Name | `<Entity>Service` classes annotated `@Service`; domain exceptions `<Reason>Exception`                 |
