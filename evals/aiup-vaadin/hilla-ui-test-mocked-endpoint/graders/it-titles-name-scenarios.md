---
criterion: "File and describe naming"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx(?=.*\b(it|test)\(\s*(\\"|\x27|`)A1: ).*\b(it|test)\(\s*(\\"|\x27|`)main scenario'
---
