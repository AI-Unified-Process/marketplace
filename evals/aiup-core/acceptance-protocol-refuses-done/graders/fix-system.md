---
criterion: "Both fixes named for the failure"
type: regex
weight: 7.5
target: { source: file, path: "session-log.md" }
pattern: '/(use-case-)?implement\b'
flags: i
---
