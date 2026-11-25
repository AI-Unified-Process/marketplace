---
criterion: "One shared container, reset per file"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*PostgreSqlContainer)[^\n]*?apps/api/test/[\w/.-]+\.[cm]?ts.*\.provide\(\s*(''|\\")\w+(''|\\")'
---
