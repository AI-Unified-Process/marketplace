---
criterion: "No migration written and no ddl-auto change"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?ddl-auto\s*[=:]\s*(update|create)'
match: not_contains
---
