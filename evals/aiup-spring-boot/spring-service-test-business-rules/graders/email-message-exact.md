---
criterion: "Exact messages"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*(hasMessage\(\s*|assertEquals\(\s*)\\"The email address (\S+|\\"\s*\+\s*[\w.()]+\s*\+\s*\\") is already registered\.\\"'
---
