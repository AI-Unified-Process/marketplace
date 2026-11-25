---
criterion: "Only the missing table"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-persistence/src/main/resources/db/migration/V\d+__[a-z0-9_]+\.sql.*CREATE TABLE (IF NOT EXISTS )?guest\b'
---
