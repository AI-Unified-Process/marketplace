---
criterion: "SQLite in-memory, not UseInMemoryDatabase"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*SqliteConnection)(?=.*\.Open(Async)?\(\)).*ShopCatalog\.Tests/[\w./-]*\.cs'
---
