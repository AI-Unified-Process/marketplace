---
criterion: "No secret values"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/[^"\s]*UC-\d{3}-[a-z0-9-]*(health|signature|verify-webhook)'
match: not_contains
---
