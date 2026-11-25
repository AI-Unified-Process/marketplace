---
criterion: "BR-001 not re-implemented in the client"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*src/[\w./-]*\.tsx?).*UC-010 BR-001'
match: not_contains
---
