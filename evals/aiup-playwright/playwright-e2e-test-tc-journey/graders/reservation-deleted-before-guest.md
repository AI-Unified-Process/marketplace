---
criterion: "Cleanup follows the Postconditions"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\.delete\(\s*[^)]*reservations[^)]*\).*\.delete\(\s*[^)]*guests).*(frontend/e2e/TC-001-[\w.-]*\.spec\.ts|(?<![\w/])e2e/TC-001-[\w.-]*\.spec\.ts)'
---
