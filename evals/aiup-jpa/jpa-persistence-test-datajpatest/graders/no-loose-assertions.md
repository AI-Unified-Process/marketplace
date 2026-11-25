---
criterion: "Exact order and projected fields"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC031SearchReservationsRepositoryTest\.java.*(isNotEmpty\(\)|hasSizeGreaterThan(OrEqualTo)?\(|isGreaterThan\(\s*0\s*\)|isPositive\(\))'
match: not_contains
---
