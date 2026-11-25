---
criterion: "Rest of UC-002 implemented"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Repository\.java.*insertInto\(\s*REGISTRATION\b'
---
