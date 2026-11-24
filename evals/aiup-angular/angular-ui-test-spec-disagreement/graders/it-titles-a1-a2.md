---
criterion: "describe marker"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\bit\(\s*(\\"|''|`)A1\b)(?=.*\bit\(\s*(\\"|''|`)A2\b).*register-guest/[\w.-]*\.spec\.ts'
---
