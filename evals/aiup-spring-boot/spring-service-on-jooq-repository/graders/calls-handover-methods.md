---
criterion: "Uses only the handed-over repository"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+Service\.java.*(?=.*\.existsByEmail\()(?=.*\.insert\()'
---
