<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of vaadin-e2e-test

The rows this skill keeps in the Markers table of the Development View (`docs/architecture/development.md`). Copy them exactly.

| Layer | Skill           | Kind | Marker to grep for                                                                                  |
|-------|-----------------|------|-----------------------------------------------------------------------------------------------------|
| E2E   | vaadin-e2e-test | Test | `@DisplayName("UC-XXX: …")` on the class and one `@Nested` `@DisplayName("A<n>: …")` per alternative flow |
| E2E   | vaadin-e2e-test | Test | `@DisplayName("TC-XXX: …")` and one `// Step <n>: <name>` comment per Flow row                         |
| E2E   | vaadin-e2e-test | Name | `UC<id><Name>IT` for a use case, `TC<id><Name>IT` for a test case journey                             |
