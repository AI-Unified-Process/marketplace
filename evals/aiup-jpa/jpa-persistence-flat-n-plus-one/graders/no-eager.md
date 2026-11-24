---
criterion: "Lazy many-to-one associations"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*\.java.*FetchType\.EAGER'
match: not_contains
---
