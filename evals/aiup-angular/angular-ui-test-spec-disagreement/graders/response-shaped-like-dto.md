---
criterion: "Request body and response shape match the contract"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\bid:\s*\d+\s*,\s*firstName:[^}]*lastName:[^}]*email:).*register-guest/[\w.-]*\.spec\.ts'
---
