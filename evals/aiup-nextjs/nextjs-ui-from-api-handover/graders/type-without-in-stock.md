---
criterion: "No entity-only field in the type"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*src/[\w./-]*\.tsx?).*\binStock\??\s*:'
match: not_contains
---
