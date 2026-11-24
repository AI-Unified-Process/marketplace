---
criterion: "One test walks the Flow"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*// Step 1:)(?=.*// Step 2:)(?=.*// Step 3:)(?=.*// Step 4:)(?=.*// Step 5:)(?=.*// Step 6:).*TC001\w*IT\.java'
---
