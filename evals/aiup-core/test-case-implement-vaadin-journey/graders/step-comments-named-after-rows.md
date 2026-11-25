---
criterion: "One test walks the Flow"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*// Step 1:\s*Create workshop)(?=.*// Step 2:\s*Verify workshop listed)(?=.*// Step 3:\s*Register participant)(?=.*// Step 4:\s*Verify confirmation)(?=.*// Step 5:\s*List participants)(?=.*// Step 6:\s*Verify participant).*TC001\w*IT\.java'
---
