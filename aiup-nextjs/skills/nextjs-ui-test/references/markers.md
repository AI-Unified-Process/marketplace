<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of nextjs-ui-test

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`), exactly as they appear there.

| Layer | Skill          | Kind | Marker to grep for                                                                                  |
|-------|----------------|------|-----------------------------------------------------------------------------------------------------|
| UI    | nextjs-ui-test | Test | `describe('UC-XXX: <Use Case Name>'`; `it('A<n>: …'` / `it('BR-YYY: …'` / `it('NFR-XXX: …'` per scenario, rule, and asserted NFR or constraint |
| UI    | nextjs-ui-test | Name | `<Component>.test.tsx`, colocated with the component that holds the markup                          |
