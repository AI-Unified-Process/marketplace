---
criterion: "Status as a string enum"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?/reservation/Reservation\.java.*@Enumerated\(\s*(value\s*=\s*)?EnumType\.STRING\s*\)(\s|\\n)*(@Column\([^)]*\)(\s|\\n)*)?(private |protected )?\w+ status\b'
---
