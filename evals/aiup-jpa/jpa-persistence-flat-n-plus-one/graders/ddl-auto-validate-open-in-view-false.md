---
criterion: "Schema stays owned by Flyway"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?application\.(properties|ya?ml).*(ddl-auto\s*[=:]\s*(?!validate)|open-in-view\s*[=:]\s*true)'
match: not_contains
---
