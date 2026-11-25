---
criterion: "Specification is the oracle"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*Guest registered\.).*register-guest/[\w.-]*\.spec\.ts'
---
