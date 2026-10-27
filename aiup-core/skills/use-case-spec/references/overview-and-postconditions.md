<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Overview Lines and Postconditions

The content rules behind workflow steps 6 and 10 of `/use-case-spec`. The labels, their order, and the German
variants are in `format-spec.md` next to this file; this file says what goes into each line.

## Overview lines

- **Primary actors** are the roles that pursue the goal. List several comma-separated
  (`**Primary Actor:** Front Desk Clerk, Guest`) when each of them can start the use case on its own and pursues
  the same goal through the same main success scenario — never joined with "or" or "and", and never "System".
  Two roles with different goals or different scenarios are two use cases. Name concrete roles from the
  requirements and the glossary rather than a generic "User" when the requirements distinguish roles.
- **Secondary actors** are the roles and external systems that support the use case or provide information or
  services to it (`**Secondary Actors:** Weather Service, Flight Planning System`). Name them so an
  implementation treats them as outside the system's responsibility, not as something to build. Omit the line
  when the use case has none.
- **Trigger** (German documents: `**Auslösendes Ereignis:**`, never `**Auslöser:**`, which labels alternative
  flows) names the **event** that starts the use case: an actor's request (`Dispatcher requests an airport
  suitability assessment`), a point in time (`End of each business day`), or a message from an external system
  (`Payment Service reports a chargeback`). It happens at a moment; a precondition is a state that is already
  true. Test it by asking "when does this happen?" — `User is logged in` has no moment and is a precondition.
  The trigger may coincide with step 1, but step 1 does not repeat it word for word.
- **Requirements**, after the `Status` line, when `docs/requirements.md` exists: one Markdown link to the
  catalog whose link text lists the requirement ids — at least the functional requirements (`FR-*`) this use
  case realizes, plus the non-functional requirements (`NFR-*`) and constraints (`C-*`) it must respect, e.g.
  `**Requirements:** [FR-001, NFR-004, C-003](../requirements.md)` (`../../requirements.md` from a module
  folder). List ids only, never copy requirement text — `requirements.md` stays the source of truth.
  `/spec-review` uses the line to find requirements no use case covers and ids that do not exist.
- **Layers** (German: `**Schichten:**`), directly after it, only when the use case is not offered through every
  entry point of the system: `UI` for an actor who works in the application's screens, `API` for an external
  system or client that calls the system, both comma-separated, or `Service` alone when no actor reaches it
  through either (a scheduled job, a message the system consumes). An administration use case of an
  application that also exposes a public API is `**Layers:** UI`. Name entry points only, never a technology
  (`Vaadin`, `REST`); the project's stack file maps them onto its layer skills, and `/use-case-implement`
  builds only the layers the line names.
- **Mockup**, directly after it, only when the team has a mockup or wireframe of the use case's screens: one or
  more comma-separated Markdown links — a Figma link, an image, or a Markdown sketch, kept under `docs/` (for
  example `docs/mockups/`), e.g. `**Mockup:** [List view](../mockups/uc-001-list.png), [Edit dialog](https://www.figma.com/design/…)`.
  The label is `**Mockup:**` in German too. The UI layer skills take the layout from it; the specification stays
  authoritative for behaviour, rules, and messages, so never move a step, a rule, or a message into the mockup, and
  never describe the layout in the steps because a mockup exists. Keep an existing line when you update a use case;
  add one only when the user names a mockup, and never ask for one.

## Failure postconditions

- **Failure Postconditions** describe the minimum guarantees that must hold for every unsuccessful
  termination of the use case — every alternative flow that ends with `Use case ends.`, a cancellation,
  or a failure of a secondary actor. They state what the system protects when the goal is not reached
  (Cockburn's *Minimal Guarantees*), not what it does in reaction to the failure: "No reservation is
  created", "Existing valid data is not overwritten", "An incomplete result is never presented as
  valid", "No partial payment remains booked". A message, a notification, or a return to a screen is
  not a guarantee — it belongs in the alternative flow that handles the failure. A statement that
  holds for only one failure path belongs in that flow, not here.
- A use case that changes no data — it only searches, lists, or shows — has nothing to protect when it
  fails. Do not write a guarantee such as "The catalog is unchanged": it holds by construction and only
  asks for a test that proves nothing. Write the italic placeholder
  `_None — the use case changes no data._` instead; the validator accepts it, and `/use-case-coverage`
  counts it as `n/a`.
