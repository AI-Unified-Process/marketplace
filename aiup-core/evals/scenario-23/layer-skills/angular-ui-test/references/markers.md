<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of angular-ui-test

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`), exactly as they appear there.

| Layer | Skill           | Kind | Marker to grep for                                                                                  |
|-------|-----------------|------|-----------------------------------------------------------------------------------------------------|
| UI    | angular-ui-test | Test | `describe('UC-XXX: <Use Case Name>'`; `it('A<n>: …'` / `it('BR-YYY: …'` per scenario and rule       |
| UI    | angular-ui-test | Name | `UC-XXX-<slug>.spec.ts`, colocated with the Angular page or service under test                       |
