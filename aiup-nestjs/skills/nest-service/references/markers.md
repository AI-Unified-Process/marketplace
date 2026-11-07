<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of nest-service

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`), exactly as they appear there.

| Layer   | Skill        | Kind | Marker to grep for                                                                                 |
|---------|--------------|------|----------------------------------------------------------------------------------------------------|
| Service | nest-service | Code | `// UC-XXX BR-YYY:` directly above the service method or guard clause that enforces the rule       |
| Service | nest-service | Code | `UC-XXX` in the TSDoc of the public service method that realizes a step or an alternative flow      |
| Service | nest-service | Name | `<feature>.service.ts` with the `@Injectable()` class `<Feature>Service`; domain errors `<Reason>Error` |
