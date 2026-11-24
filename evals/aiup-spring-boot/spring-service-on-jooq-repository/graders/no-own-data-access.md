---
criterion: "Uses only the handed-over repository"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+Service\.java.*\b(DSLContext|JdbcTemplate|NamedParameterJdbcTemplate|EntityManager|JdbcClient)\b'
match: not_contains
---
