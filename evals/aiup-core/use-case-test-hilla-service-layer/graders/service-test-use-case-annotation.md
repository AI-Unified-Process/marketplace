---
criterion: "Service tests cover the use case"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002\w*ServiceTest\.java.*@UseCase\(\s*id\s*=\s*\\"UC-002\\"'
---
