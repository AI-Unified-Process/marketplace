---
criterion: "Glossary terms"
type: regex
weight: 1
target: { source: file, path: "docs/user_guide/README.md" }
pattern: '\|\s*Avoid\s*\|'
match: not_contains
---
