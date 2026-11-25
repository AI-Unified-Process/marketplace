---
criterion: "Only Tested and Done use cases"
type: regex
weight: 4
target: { source: file, path: "docs/user_guide/organizer.md" }
pattern: '(^|\n)## [^\n]+\n<!-- UC-001 spec=[0-9a-f]+ text=[0-9a-f]+ -->'
---
