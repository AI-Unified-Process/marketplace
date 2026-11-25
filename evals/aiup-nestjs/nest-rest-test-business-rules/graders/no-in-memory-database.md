---
criterion: "Testcontainers PostgreSQL, not a mock"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/(test/[\w/.-]+|vitest[\w.-]*)\.[cm]?ts.*(from\s+(''|\\")(pg-mem|better-sqlite3|sqlite3|@electric-sql/pglite)|drizzle-orm/(better-sqlite3|pglite|libsql|pg-proxy))'
match: not_contains
---
