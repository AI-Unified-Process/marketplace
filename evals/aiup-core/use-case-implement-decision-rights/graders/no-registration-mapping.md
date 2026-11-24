---
criterion: "No new endpoint path"
type: regex
weight: 12
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Controller\.java.*@(Post|Get|Put|Request)Mapping\(\s*((value|path)\s*=\s*)?\{?\s*\\"[^\\"]*[Rr]egist'
match: not_contains
---
