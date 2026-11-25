---
criterion: "Expected values from the test case"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(1 free place\b|[Ff]ree [Pp]laces?)).*TC001\w*IT\.java'
---
