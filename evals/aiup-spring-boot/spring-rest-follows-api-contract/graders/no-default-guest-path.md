---
criterion: "Path and method from the operation"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Controller\.java.*\\"/api/(v1/)?guests'
match: not_contains
---
