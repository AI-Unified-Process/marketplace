---
criterion: "BR-001 not re-implemented in the client"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*src/app/[\w./-]*\.(ts|html)).*UC-010 BR-001'
match: not_contains
---
