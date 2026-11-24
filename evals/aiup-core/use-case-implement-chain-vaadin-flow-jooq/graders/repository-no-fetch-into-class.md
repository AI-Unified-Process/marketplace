---
criterion: "jOOQ repositories"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^\"]*Repository\.java.*fetchInto\(\w+\.class\)'
match: not_contains
---
