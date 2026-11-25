---
criterion: "Constraint violation mapped"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*23505)(?=.*EmailAlreadyRegistered\w*)[^\n]*?apps/api/src/guests/guests\.service\.ts'
---
