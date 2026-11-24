---
criterion: "Only Tested and Done use cases"
type: regex
weight: 1
target: { source: file, path: "docs/user_guide/README.md" }
pattern: '<!--\s*UC-00[356]\b'
match: not_contains
---
