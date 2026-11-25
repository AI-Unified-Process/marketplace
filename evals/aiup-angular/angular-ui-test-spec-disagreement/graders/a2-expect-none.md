---
criterion: "A2 asserts no request is sent"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(expectNone\(|\.match\([^)]*\)\)\s*\.\s*toHaveLength\(0\))).*register-guest/[\w.-]*\.spec\.ts'
---
