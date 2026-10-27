<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of spring-client-test

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`). Copy them exactly.

| Layer  | Skill              | Kind | Marker to grep for                                                                                   |
|--------|--------------------|------|------------------------------------------------------------------------------------------------------|
| Client | spring-client-test | Test | `@UseCase(id = "UC-XXX", scenario = "…")` on every adapter test method                               |
| Client | spring-client-test | Name | `<System>ClientTest` adapter tests; `<System>ClientFake` in the test sources                         |
