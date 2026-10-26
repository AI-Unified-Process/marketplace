<!--
Copyright 2025-2026 Simon Martinelli and the AI Unified Process contributors.
Part of the AI Unified Process — https://unifiedprocess.ai
Licensed under the Apache License, Version 2.0. See LICENSE and NOTICE.
-->

# Business process

`/business-process` writes BPMN 2.0 models to `docs/processes/BP-XXX-<name>.bpmn` from the requirements and the use
case diagram; `/business-process BP-XXX` updates one. It needs no use case specification, so it can run right after
`/use-case-diagram`; specifications are read only when they exist, and `/test-case BP-XXX` is what needs them. The
`BP-XXX` id is both the file prefix and the `id` of the `<bpmn:process>` element, so it survives a round trip through
a modeler; `spec_lint.py` reports `BP_ID_MISMATCH`, `DUPLICATE_ID`, and (for hand-drawn legacy models) `BP_NO_ID`,
and `/test-case BP-XXX` cites it in the `**Process:**` line.

- **Every activity is a use case of the diagram.** When the flow needs a step without one, the skill writes nothing
  and hands off to `/use-case-diagram`. `spec_lint.py` matches activities against the diagram as well as the
  specifications (`BPMN_UNMAPPED`); a diagram use case still lacking a specification is `SPEC_MISSING`. The process
  sits above the use cases; it never replaces them, and a use case never carries a process model (see the goal-level
  check in `/use-case-diagram`).
- **The agent never writes diagram coordinates.** `skills/business-process/scripts/bpmn_layout.py` (standard library
  only) adds DI for elements without a shape and keeps every existing shape byte for byte, so a layout tidied in a
  modeler survives reruns; it rewrites only the `BPMNDiagram` block. It imports `parse_xml` from `bpmn_paths.py` in
  the sibling test-case skill folder by glob, like `spec_lint.py` — keep one copy of the parser.
