---
criterion: "Reuses existing annotation and container setup"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/test/\S*?\.java.*(new\s+PostgreSQLContainer|@Container\b|@interface\s+UseCase\b)'
match: not_contains
---
