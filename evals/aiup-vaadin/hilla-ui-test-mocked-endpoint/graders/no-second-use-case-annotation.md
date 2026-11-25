---
criterion: "Endpoint contract test class"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?![^\n]{0,40}\b(grep|rg|find)\b)[^\n]*?\.java[^\n]*?@interface\s+UseCase\b'
match: not_contains
---
