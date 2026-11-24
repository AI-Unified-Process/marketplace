---
criterion: "SQLite in-memory, not UseInMemoryDatabase"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*UseSqlite\()(?=.*:memory:).*ShopCatalog\.Tests/[\w./-]*\.cs'
---
