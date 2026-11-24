---
criterion: "Only Tested and Done use cases"
type: regex
weight: 2
target: { source: file, path: "docs/user_guide/participant.md" }
pattern: '<!--\s*UC-00[356]\b'
match: not_contains
---
