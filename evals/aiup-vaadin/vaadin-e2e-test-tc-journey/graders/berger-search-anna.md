---
criterion: "Validation scoped to the journey's rows"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\\"Berger\\")(?=.*Anna).*TC003\w*IT\.java'
---
