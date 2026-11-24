---
criterion: "One use case per file"
type: llm
weight: 4
focus: { source: file, path: "docs/use_cases/UC-001-book-room.md" }
---

Scenario: Tests whether the agent writes use case specifications at the business level, avoids technical implementation language in steps, structures alternative flows correctly with step-number triggers and returns, files each use case separately with the correct naming convention, and numbers business rules per use case.

Criterion "One use case per file": Each file documents exactly one use case — UC-001 file does NOT contain UC-002 content and vice versa

You are shown only docs/use_cases/UC-001-book-room.md, the specification of UC-001 Book Room. The criterion is checked once per file; judge it for this file alone (where it speaks of both files or the other file, apply it to this file's use case; a rule of the other use case may only be referenced qualified with its use case id).

PASS if this file meets the criterion. FAIL if it does not, or if the file is missing.
