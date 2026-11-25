---
criterion: "Assertions that compile"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*getContentLocator\(\)).*TC003\w*IT\.java'
---
