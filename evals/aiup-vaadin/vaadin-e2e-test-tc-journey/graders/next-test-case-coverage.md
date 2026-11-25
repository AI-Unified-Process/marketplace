---
criterion: "Reports expected failure and hands off"
type: regex
weight: 3
target: { source: file, path: "session-log.md" }
pattern: 'Next:\s*`?/test-case-coverage TC-003'
---
