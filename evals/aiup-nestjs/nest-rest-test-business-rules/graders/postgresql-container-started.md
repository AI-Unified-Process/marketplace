---
criterion: "Testcontainers PostgreSQL, not a mock"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@testcontainers/postgresql)(?=.*PostgreSqlContainer)[^\n]*?apps/api/(test/[\w/.-]+|vitest[\w.-]*)\.[cm]?ts'
---
