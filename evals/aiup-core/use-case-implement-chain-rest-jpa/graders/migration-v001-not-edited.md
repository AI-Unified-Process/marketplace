---
criterion: "Migration with the BR-002 marker"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?V001__'
match: not_contains
---
