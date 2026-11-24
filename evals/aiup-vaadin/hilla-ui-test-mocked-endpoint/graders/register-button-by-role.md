---
criterion: "Semantic queries and awaited userEvent"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx.*ByRole\(\s*(\\"|\x27|`)button(\\"|\x27|`)\s*,\s*\{\s*name:\s*((\\"|\x27|`)Register(\\"|\x27|`)|/\^?Register)'
---
