---
criterion: "Reports, status, and documents"
type: regex
weight: 0.25
target: { source: file, path: "session-log.md" }
pattern: '([Ll]eft out[^\n]*BR-003|BR-003[^\n]*left out)'
---
