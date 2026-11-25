---
criterion: "Hilla UI tests"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-002-[\w-]+\.test\.tsx.*describe\(\s*(\\"|\x27|`)UC-002: '
---
