---
criterion: "Columns follow the entity model"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-persistence/src/main/resources/db/migration/V\d+__[a-z0-9_]+\.sql.*\blast_name\s+VARCHAR\(100\)\s+NOT NULL'
---
