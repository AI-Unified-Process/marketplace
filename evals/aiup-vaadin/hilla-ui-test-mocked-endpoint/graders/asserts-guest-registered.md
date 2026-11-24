---
criterion: "Main scenario asserts the specified message"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx.*(\\"|\x27|`)Guest registered(\\"|\x27|`)'
---
