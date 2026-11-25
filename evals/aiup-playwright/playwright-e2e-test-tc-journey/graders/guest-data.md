---
criterion: "Test data from the Flow table"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(\\"|''|`)Mia(\\"|''|`))(?=.*(\\"|''|`)Keller(\\"|''|`))(?=.*mia\.keller@example\.com).*(frontend/e2e/TC-001-[\w.-]*\.spec\.ts|(?<![\w/])e2e/TC-001-[\w.-]*\.spec\.ts)'
---
