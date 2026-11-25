---
criterion: "Seed data not duplicated"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(frontend/e2e/TC-001-[\w.-]*\.spec\.ts|(?<![\w/])e2e/TC-001-[\w.-]*\.spec\.ts)).*(post\(\s*(\\"|''|`)[^\n]*?/api/room-types|INSERT INTO room_type)'
match: not_contains
---
