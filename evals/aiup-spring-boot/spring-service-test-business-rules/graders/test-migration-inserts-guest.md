---
criterion: "Test data from the use case's test migration"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/test/resources/db/migration/R__uc001_register_guest\.sql.*insert\s+into\s+guest\s*\((\s*id\b[^;]*nextval\(\s*''guest_seq''\s*\)|(?!\s*id\b))'
flags: i
---
