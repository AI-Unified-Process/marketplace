<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Design notes

Why the marketplace is built the way it is. These pages are for maintainers; the rules they explain are summarized
in the repository's `CLAUDE.md`, and a change to a rule is made there and here together.

| Page                                                  | Explains                                                                       |
|-------------------------------------------------------|--------------------------------------------------------------------------------|
| [Layered construction](layered-construction.md)       | The stack file, layer discovery, the integration layer, E2E scope, and markers |
| [Spec review](spec-review.md)                         | The deterministic lint, the semantic review, and why the review converges      |
| [Open questions](open-questions.md)                   | The log of specification gaps, who writes what, and blocking questions         |
| [Architecture decisions](architecture-decisions.md)   | ADRs linked to NFRs and constraints, statuses, and lint                        |
| [Decision rights](decision-rights.md)                 | What the agent decides alone, asks about first, or never does                  |
| [Mockups](mockups.md)                                 | The optional mockup line and why the specification wins over it                |
| [Modules in the diagrams](modules.md)                 | Splitting the use case diagram and the entity model by module                  |
| [Business process](business-process.md)               | BPMN models, BP ids, and the layout script                                     |
| [Transition](transition.md)                           | User guide, acceptance protocol, release notes, and who sets `Done`            |
| [Coverage sub-agent](coverage-agent.md)               | The read-only coverage auditor and its front door                              |
