---
criterion: "jOOQ repositories"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^\"]*Repository\.java.*(@Transactional|\.transaction\()'
match: not_contains
---
