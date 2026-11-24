---
criterion: "Report and no other docs change"
type: regex
weight: 3
target: { source: file, path: "session-log.md" }
pattern: '(?=[\s\S]*OQ-002)[\s\S]*OQ-003'
---
