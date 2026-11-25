---
criterion: "Hand-off to the persistence skill"
type: regex
weight: 3
target: { source: file, path: "session-log.md" }
pattern: 'Next:[^\n]*(coverage|audit)'
match: not_contains
---
