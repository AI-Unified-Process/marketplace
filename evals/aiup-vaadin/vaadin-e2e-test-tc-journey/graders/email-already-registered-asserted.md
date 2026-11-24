---
criterion: "Expected messages from the specification"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\\"Email already registered\\").*TC003\w*IT\.java'
---
