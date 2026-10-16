<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of spring-service-test

The rows this skill keeps in the Markers table of the Development View (`docs/architecture/development.md`). Copy them exactly.

| Layer   | Skill               | Kind | Marker to grep for                                                                                   |
|---------|---------------------|------|------------------------------------------------------------------------------------------------------|
| Service | spring-service-test | Test | `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-YYY"})` on every service test method   |
| Service | spring-service-test | Name | `UC<id><Name>ServiceTest`, e.g. `UC001RegisterGuestServiceTest`                                      |
