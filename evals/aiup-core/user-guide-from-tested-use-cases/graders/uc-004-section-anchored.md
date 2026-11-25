---
criterion: "Only Tested and Done use cases"
type: regex
weight: 3
target: { source: file, path: "docs/user_guide/participant.md" }
pattern: '(^|\n)## [^\n]+\n<!-- UC-004 spec=[0-9a-f]+ text=[0-9a-f]+ -->'
---
