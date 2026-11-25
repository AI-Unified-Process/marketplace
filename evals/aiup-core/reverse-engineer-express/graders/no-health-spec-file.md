---
criterion: "No /health use case"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/use_cases/[^"\s]*UC-\d{3}-[a-z0-9-]*(health|heartbeat|liveness)'
match: not_contains
---
