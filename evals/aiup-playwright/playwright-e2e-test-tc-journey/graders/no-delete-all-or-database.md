---
criterion: "Cleanup follows the Postconditions"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(frontend/e2e/TC-001-[\w.-]*\.spec\.ts|(?<![\w/])e2e/TC-001-[\w.-]*\.spec\.ts)).*(DELETE FROM|TRUNCATE|from\s*(\\"|''|`)(pg|postgres|mysql2)(\\"|''|`)|\.delete\(\s*(\\"|''|`)/api/(guests|reservations)(\\"|''|`))'
match: not_contains
---
