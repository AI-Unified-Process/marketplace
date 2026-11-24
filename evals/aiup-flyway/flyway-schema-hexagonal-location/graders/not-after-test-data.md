---
criterion: "Next version number from the main migrations"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?/db/migration/V(100[1-9]|10[1-9]\d|1[1-9]\d\d|[2-9]\d{3}|\d{5,})__[a-z0-9_]+\.sql'
match: not_contains
---
