---
criterion: "Exact messages"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*(hasMessage\(\s*|assertEquals\(\s*)\\"Guests must be at least 18 years old on the day of arrival\.\\"'
---
