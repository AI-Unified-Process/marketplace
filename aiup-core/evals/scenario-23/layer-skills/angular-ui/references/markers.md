<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of angular-ui

The rows this skill keeps in the Markers table of the Development View (`docs/architecture/development.md`), exactly as they appear there.

| Layer | Skill      | Kind | Marker to grep for                                                                                          |
|-------|------------|------|-------------------------------------------------------------------------------------------------------------|
| UI    | angular-ui | Code | `/** UC-XXX: <Use Case Name> */` directly above the routed page component class                             |
| UI    | angular-ui | Code | `// UC-XXX BR-YYY:` directly above an Angular form validator, only for a rule the UI also validates          |
| UI    | angular-ui | Name | page `src/app/pages/<page>/<page>.ts`, route in `app.routes.ts`, HTTP service `src/app/services/<entity>.ts` with `<entity>.model.ts` |
