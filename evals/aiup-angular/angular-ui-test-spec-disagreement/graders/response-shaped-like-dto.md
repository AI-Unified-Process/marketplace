---
criterion: "Request body and response shape match the contract"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\bid:\s*\d+\s*,\s*firstName:[^}]*lastName:[^}]*email:|.*?\b(\w+)(:\s*\w+)?\s*=\s*\{\s*firstName:[^}]*lastName:[^}]*email:[^}]*\}(?=.*\{\s*id:\s*\d+\s*,\s*\.\.\.\2\s*\})).*register-guest/[\w.-]*\.spec\.ts'
---
