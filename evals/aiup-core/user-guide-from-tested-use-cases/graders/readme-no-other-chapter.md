---
criterion: "One chapter per primary actor"
type: regex
weight: 2
target: { source: file, path: "docs/user_guide/README.md" }
pattern: '\]\(\s*(\./)?(?!organizer\.md|participant\.md|README\.md)[\w-]+\.md\s*\)'
match: not_contains
---
