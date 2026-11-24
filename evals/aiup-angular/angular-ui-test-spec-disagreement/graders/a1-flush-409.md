---
criterion: "A1 asserts the full message"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\.flush\()(?=.*status:\s*409\b).*register-guest/[\w.-]*\.spec\.ts'
---
