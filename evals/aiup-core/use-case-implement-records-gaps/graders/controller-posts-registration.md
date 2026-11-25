---
criterion: "Rest of UC-002 implemented"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@PostMapping)(?=.*[Rr]egistr)[^\n]*?Controller\.java'
---
