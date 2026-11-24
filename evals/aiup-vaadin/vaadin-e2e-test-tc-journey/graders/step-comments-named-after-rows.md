---
criterion: "One test, one step per Flow row"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*// Step 1:\s*Register guest)(?=.*// Step 2:\s*Verify guest registered)(?=.*// Step 3:\s*Register duplicate email)(?=.*// Step 4:\s*Verify duplicate rejected)(?=.*// Step 5:\s*Find guest)(?=.*// Step 6:\s*Verify one guest found).*TC003\w*IT\.java'
---
