---
criterion: "No fetchInto and no @Transactional"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*\.java.*\.fetch(One|Single|Optional)?Into\(\w+\.class\)'
match: not_contains
---
