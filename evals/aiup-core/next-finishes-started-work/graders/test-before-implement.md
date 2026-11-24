---
criterion: "Started work before new work"
type: regex
weight: 15
target: { source: file, path: "session-log.md" }
pattern: '^(?:(?!/use-case-implement\W+UC-00[14])[\s\S])*/use-case-test\W+UC-002'
flags: i
---
