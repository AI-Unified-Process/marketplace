---
criterion: "Service tests cover the use case"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002\w*ServiceTest\.java(?=.*This workshop is fully booked\.)(?=.*Registration for this workshop has closed\.)(?=.*You are already registered for this workshop\.)'
---
