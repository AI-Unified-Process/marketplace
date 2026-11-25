---
criterion: "Existing products repository extended"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/src/orders/[\w/.-]+\.ts.*\.(update|from|select)\(\s*products\s*\)'
match: not_contains
---
