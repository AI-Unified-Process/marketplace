---
criterion: "Alt flow ending"
type: llm
weight: 5
focus: { source: file, path: "docs/use_cases/UC-001-book-room.md" }
---

Scenario: Tests whether the agent writes use case specifications at the business level, avoids technical implementation language in steps, structures alternative flows correctly with step-number triggers and returns, files each use case separately with the correct naming convention, and numbers business rules per use case.

Criterion "Alt flow ending": Every alternative flow in both files ends with either a return to a numbered step (e.g., 'Use case continues at step N') or an explicit ending ('Use case ends')

You are shown only docs/use_cases/UC-001-book-room.md, the specification of UC-001 Book Room. The criterion is checked once per file; judge it for this file alone (where it speaks of both files or the other file, apply it to this file's use case; a rule of the other use case may only be referenced qualified with its use case id).

PASS if this file meets the criterion. FAIL if it does not, or if the file is missing.
