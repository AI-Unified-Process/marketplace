---
criterion: "Cleanup per the postconditions"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@AfterEach).*TC001\w*IT\.java'
---
