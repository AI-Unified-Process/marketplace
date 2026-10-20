<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of spring-rest-test

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`). Copy them exactly.

| Layer | Skill            | Kind | Marker to grep for                                                                                 |
|-------|------------------|------|----------------------------------------------------------------------------------------------------|
| API   | spring-rest-test | Test | `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-YYY"})` on every API test method     |
| API   | spring-rest-test | Name | `UC<id><Name>ApiTest`, or `UC<id><Name>ApiIT` for live-server tests run by Failsafe                |
