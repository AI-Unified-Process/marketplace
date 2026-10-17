<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Markers of vaadin-flow-ui

The rows this skill keeps in the Markers table of the Development View (`docs/architecture/development.md`). Copy them exactly; the generic business
rule row (`All`) belongs to `/architecture` and is not repeated here.

| Layer | Skill          | Kind | Marker to grep for                                                                                     |
|-------|----------------|------|--------------------------------------------------------------------------------------------------------|
| UI    | vaadin-flow-ui | Code | `UC-XXX` in the view's class Javadoc (`/** UC-XXX <Use Case Name>. */`)                                 |
| UI    | vaadin-flow-ui | Code | `// UC-XXX BR-YYY:` directly above the `Binder` validator or UI guard that enforces the rule            |
| UI    | vaadin-flow-ui | Name | `@Route` view class `<Name>View` named after the use case (`ManagePersonsView` for "Manage Persons")    |
