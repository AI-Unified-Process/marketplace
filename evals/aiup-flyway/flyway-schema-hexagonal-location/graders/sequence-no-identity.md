---
criterion: "Sequence primary key and snake_case"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-persistence/src/main/resources/db/migration/V\d+__[a-z0-9_]+\.sql.*(IDENTITY|AUTO_INCREMENT|AUTOINCREMENT|\bSERIAL\b|BIGSERIAL)'
match: not_contains
---
