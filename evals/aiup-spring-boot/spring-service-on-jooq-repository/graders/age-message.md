---
criterion: "Domain exceptions with specification messages"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+\.java.*\\"Guests must be at least 18 years old on the day of arrival\.\\"'
---
