---
criterion: "Sequence primary key and snake_case"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-persistence/src/main/resources/db/migration/V\d+__[a-z0-9_]+\.sql.*\bid\s+BIGINT\s+(NOT NULL\s+)?DEFAULT\s+nextval\(\s*''guest_seq'''
---
