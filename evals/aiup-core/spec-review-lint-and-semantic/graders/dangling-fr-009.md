---
criterion: "Dangling requirement reported"
type: regex
weight: 8
target: { source: file, path: "session-log.md" }
pattern: 'UC-002[^\n]*FR-009|FR-009[^\n]*UC-002'
flags: i
---
