<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of hilla-ui-test

The rows this skill keeps in the Markers table of the Development View (`docs/architecture/development.md`). Copy them exactly.

| Layer | Skill         | Kind | Marker to grep for                                                                   |
|-------|---------------|------|--------------------------------------------------------------------------------------|
| UI    | hilla-ui-test | Test | `describe('UC-XXX: …'` with `it('A<n>: …'` per alternative flow                       |
| UI    | hilla-ui-test | Name | `src/main/frontend/tests/UC-XXX-<slug>.test.tsx`                                     |
| UI    | hilla-ui-test | Test | `@UseCase(id = "UC-XXX", scenario = "…")` on every endpoint contract test method   |
| UI    | hilla-ui-test | Name | `UC<id><Name>EndpointTest`, in the test sources of the endpoint's module             |
