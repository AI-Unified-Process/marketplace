---
criterion: "TC traceability"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@DisplayName\(\s*\\"TC-003:).*TC003\w*IT\.java'
---
