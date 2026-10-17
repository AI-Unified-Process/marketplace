<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of playwright-e2e-test

The rows this skill keeps in the Markers table of the Development View (`docs/architecture/development.md`), exactly as they appear there.

| Layer | Skill               | Kind | Marker to grep for                                                                                         |
|-------|---------------------|------|------------------------------------------------------------------------------------------------------------|
| E2E   | playwright-e2e-test | Test | `{ tag: '@UC-XXX' }` / `{ tag: '@TC-XXX' }` on every test inside `test.describe('UC-XXX: …'` / `test.describe('TC-XXX: …'` — the tag tells it from an `angular-ui-test` suite |
| E2E   | playwright-e2e-test | Test | one `test.step('Step <n>: …'` preceded by `// Step <n>: <name>` per Flow row of a test case                  |
| E2E   | playwright-e2e-test | Name | `<E2E folder>/UC-XXX-<slug>.spec.ts` / `<E2E folder>/TC-XXX-<slug>.spec.ts`, the folder the Location of the E2E row in the Layers table names (e.g. `e2e/`) |
