---
criterion: "One test with one step per Flow row"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*test\.step\(\s*(\\"|''|`)Step 1: Register guest(\\"|''|`))(?=.*test\.step\(\s*(\\"|''|`)Step 2: Verify guest listed(\\"|''|`))(?=.*test\.step\(\s*(\\"|''|`)Step 3: Book room(\\"|''|`))(?=.*test\.step\(\s*(\\"|''|`)Step 4: Verify confirmation(\\"|''|`)).*(frontend/e2e/TC-001-[\w.-]*\.spec\.ts|(?<![\w/])e2e/TC-001-[\w.-]*\.spec\.ts)'
flags: i
---
