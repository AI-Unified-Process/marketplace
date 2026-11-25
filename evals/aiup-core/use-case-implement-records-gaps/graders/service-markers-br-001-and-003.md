---
criterion: "Rest of UC-002 implemented"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*// UC-002 BR-001\b)(?=.*// UC-002 BR-003\b)[^\n]*?Service\.java'
---
