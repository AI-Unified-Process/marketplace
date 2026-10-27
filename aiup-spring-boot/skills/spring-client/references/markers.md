<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of spring-client

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`). Copy them exactly; the generic business
rule row (`All`) belongs to `/stack` and is not repeated here.

| Layer  | Skill         | Kind | Marker to grep for                                                                                         |
|--------|---------------|------|------------------------------------------------------------------------------------------------------------|
| Client | spring-client | Code | `UC-XXX` in the Javadoc of the outbound port method that realizes a step or an alternative flow            |
| Client | spring-client | Code | `// UC-XXX BR-YYY:` directly above an adapter check that enforces a rule of the external system             |
| Client | spring-client | Name | `<System>Client` port interfaces; `<System>RestClient` / `<System>Publisher` adapters implementing them      |
