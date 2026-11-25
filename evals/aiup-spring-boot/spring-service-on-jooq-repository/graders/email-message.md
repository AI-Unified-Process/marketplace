---
criterion: "Domain exceptions with specification messages"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+\.java.*The email address (\\"\s*\+\s*[\w.()]+\s*\+\s*\\"|%s|\{0\}) is already registered\.'
---
