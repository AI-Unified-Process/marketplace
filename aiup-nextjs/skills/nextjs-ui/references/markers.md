<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of nextjs-ui

The rows this skill keeps in the Markers table of the stack file (`docs/architecture/stack.md`), exactly as they appear there.

| Layer | Skill     | Kind | Marker to grep for                                                                                          |
|-------|-----------|------|-------------------------------------------------------------------------------------------------------------|
| UI    | nextjs-ui | Code | `/** UC-XXX: <Use Case Name> */` directly above the component that holds the page's markup                  |
| UI    | nextjs-ui | Code | `// UC-XXX BR-YYY:` directly above a form validation, only for a rule the UI also validates                 |
| UI    | nextjs-ui | Name | route `src/app/<route>/page.tsx`, or with route indirection its view component beside its siblings; contract types in the shared package when the project has one |
