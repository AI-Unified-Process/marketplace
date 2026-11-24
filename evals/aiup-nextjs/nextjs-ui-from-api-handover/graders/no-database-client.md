---
criterion: "Layer boundaries respected"
type: regex
weight: 1.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*src/[\w./-]*\.tsx?).*(from\s*(\\"|''|`)(pg|postgres|mysql2|better-sqlite3|drizzle-orm[\w/-]*|@prisma/client|kysely)(\\"|''|`))'
match: not_contains
---
