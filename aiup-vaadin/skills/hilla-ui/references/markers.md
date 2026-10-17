<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of hilla-ui

The rows this skill keeps in the Markers table of the Development View (`docs/architecture/development.md`). Copy them exactly; the generic business
rule row (`All`) belongs to `/architecture` and is not repeated here.

| Layer | Skill    | Kind | Marker to grep for                                                                                        |
|-------|----------|------|-----------------------------------------------------------------------------------------------------------|
| UI    | hilla-ui | Code | `UC-XXX` in the view's file comment and the endpoint's class Javadoc                                      |
| UI    | hilla-ui | Code | `// UC-XXX BR-YYY:` directly above the `useForm` field validator or UI guard in the `.tsx` view that enforces the rule |
| UI    | hilla-ui | Name | view file `src/main/frontend/views/<route>.tsx` exporting `<Name>View`; `@BrowserCallable` class `<Entity>Endpoint` |
