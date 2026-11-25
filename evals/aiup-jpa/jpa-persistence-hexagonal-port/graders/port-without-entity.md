---
criterion: "Outbound port as a plain sibling interface"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-business/src/main/java/[^"]*/GuestRepository\.java.*GuestEntity'
match: not_contains
---
