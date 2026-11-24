---
criterion: "At least one alt flow per use case"
type: llm
weight: 4
focus: { source: file, path: "docs/use_cases/UC-002-check-in-guest.md" }
---

Scenario: Tests whether the agent writes use case specifications at the business level, avoids technical implementation language in steps, structures alternative flows correctly with step-number triggers and returns, files each use case separately with the correct naming convention, and numbers business rules per use case.

Criterion "At least one alt flow per use case": UC-001 has at least one alternative flow AND UC-002 has at least one alternative flow

You are shown only docs/use_cases/UC-002-check-in-guest.md, the specification of UC-002 Check In Guest. The criterion is checked once per file; judge it for this file alone (where it speaks of both files or the other file, apply it to this file's use case; a rule of the other use case may only be referenced qualified with its use case id).

PASS if this file meets the criterion. FAIL if it does not, or if the file is missing.
