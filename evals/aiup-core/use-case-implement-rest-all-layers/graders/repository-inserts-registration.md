---
criterion: "Persistence"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Repository\.java.*insertInto\(\s*REGISTRATION\b'
---
