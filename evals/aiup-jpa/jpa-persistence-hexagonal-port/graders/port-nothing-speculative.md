---
criterion: "Port offers what UC-020 needs and nothing speculative"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-business/src/main/java/[^"]*/GuestRepository\.java.*\b(delete\w*|findAll\w*|search\w*|update\w*|findByLastName\w*)\('
match: not_contains
---
