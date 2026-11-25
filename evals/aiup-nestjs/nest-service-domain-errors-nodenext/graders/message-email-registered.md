---
criterion: "Exact messages"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/src/[\w/.-]+\.ts.*(`The email address \$\{[^}]+\} is already registered\.`|(''|\\")The email address (''|\\") \+ [\w.]+ \+ (''|\\") is already registered\.(''|\\"))'
---
