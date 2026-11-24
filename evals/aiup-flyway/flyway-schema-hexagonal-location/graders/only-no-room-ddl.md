---
criterion: "Only the missing table"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?V\d+__[a-z0-9_]+\.sql.*(CREATE|ALTER|DROP) TABLE (IF (NOT )?EXISTS )?(room_type|room)\b'
match: not_contains
---
