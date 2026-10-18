<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of vaadin-flow-ui-test

The rows this skill keeps in the Markers table of the Development View (`docs/architecture/development.md`). Copy them exactly.

| Layer | Skill               | Kind | Marker to grep for                                                                                          |
|-------|---------------------|------|-------------------------------------------------------------------------------------------------------------|
| UI    | vaadin-flow-ui-test | Test | `@UseCase(id = "UC-XXX", scenario = "…", businessRules = {"BR-YYY"}, requirements = {"NFR-XXX"})` on every Browserless test method     |
| UI    | vaadin-flow-ui-test | Name | `UC<id><Name>Test`, e.g. `UC001ManagePersonsTest`, extending `SpringBrowserlessTest`                       |
