---
criterion: "Configuration without credentials in code"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?\.java.*([Aa]pi[Kk]ey\s*=\s*\\"[^\\"]+\\"|\\"Bearer [A-Za-z0-9_]{6,}|\\"(sk|pk)_(live|test)_)'
match: not_contains
---
