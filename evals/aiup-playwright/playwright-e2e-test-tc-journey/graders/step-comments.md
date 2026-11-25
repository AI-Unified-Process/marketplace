---
criterion: "One test with one step per Flow row"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*// Step 1: Register guest)(?=.*// Step 2: Verify guest listed)(?=.*// Step 3: Book room)(?=.*// Step 4: Verify confirmation).*(frontend/e2e/TC-001-[\w.-]*\.spec\.ts|(?<![\w/])e2e/TC-001-[\w.-]*\.spec\.ts)'
flags: i
---
