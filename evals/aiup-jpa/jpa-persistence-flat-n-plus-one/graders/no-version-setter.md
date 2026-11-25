---
criterion: "Optimistic locking with @Version"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?/reservation/Reservation\.java.*void setVersion\('
match: not_contains
---
