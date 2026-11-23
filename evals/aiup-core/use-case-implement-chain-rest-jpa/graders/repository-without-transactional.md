---
criterion: "JPA persistence with markers"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Repository\.java.*@Transactional'
match: not_contains
---
