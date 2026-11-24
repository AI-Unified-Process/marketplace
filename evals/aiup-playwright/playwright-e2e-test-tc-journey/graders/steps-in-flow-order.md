---
criterion: "One test with one step per Flow row"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*test\.step\(\s*(\\"|''|`)Step 1: .*test\.step\(\s*(\\"|''|`)Step 2: .*test\.step\(\s*(\\"|''|`)Step 3: .*test\.step\(\s*(\\"|''|`)Step 4: ).*(frontend/e2e/TC-001-[\w.-]*\.spec\.ts|(?<![\w/])e2e/TC-001-[\w.-]*\.spec\.ts)'
---
