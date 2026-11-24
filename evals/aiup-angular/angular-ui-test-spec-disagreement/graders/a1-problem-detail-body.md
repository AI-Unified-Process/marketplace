---
criterion: "A1 asserts the full message"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*detail:\s*(\\"|''|`)This email address is already registered\.(\\"|''|`)).*register-guest/[\w.-]*\.spec\.ts'
---
