---
criterion: "Reports, status, and documents"
type: llm
weight: 3
focus: { source: file, path: "session-log.md" }
---

The agent ran /use-case-implement and then /use-case-test for UC-001; BR-003 holds a blocking open question OQ-001.

PASS if all of these hold: the implementation report ends with an Open questions list naming OQ-001 (UC-001 BR-003) as left out, hands off to /use-case-spec UC-001, and ends with `Next: /use-case-test UC-001`; the test report lists the BR-003 test as left out because of the blocking question and ends with `Next: /use-case-coverage UC-001`; nothing in the messages claims the status of UC-001 was changed.
FAIL if any of them is missing.
