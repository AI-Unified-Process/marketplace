---
criterion: "Records.mapping into a Java record"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*\.java.*\.fetch(One|Single|Optional)?Into\(\w+\.class\)'
match: not_contains
---
