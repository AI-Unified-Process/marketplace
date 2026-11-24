---
criterion: "No business logic in the controller"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Controller\.java.*(existsBy|\bPeriod\.|plusYears|minusYears|isBefore|isAfter|getYears)'
match: not_contains
---
