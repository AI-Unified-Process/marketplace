---
criterion: "Sequence primary key and snake_case"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\bfirst_name\s)(?=.*\blast_name\s)(?=.*\bbirth_date\s)(?!.*(firstName|lastName|birthDate))[^\n]*?hotel-persistence/src/main/resources/db/migration/V\d+__[a-z0-9_]+\.sql'
---
