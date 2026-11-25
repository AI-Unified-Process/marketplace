---
criterion: "Expected values from the test case"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*You are registered for (Clean Architecture Basics\.|\\"\s*\+)).*TC001\w*IT\.java'
---
