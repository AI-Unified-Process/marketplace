---
criterion: "One test walks the Flow"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@DisplayName\(\s*\\"TC-001: ).*TC001\w*IT\.java'
---
