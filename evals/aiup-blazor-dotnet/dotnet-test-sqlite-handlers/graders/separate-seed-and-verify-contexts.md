---
criterion: "Fresh DbContext per AAA phase"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*ShopCatalog\.Tests/[\w./-]*\.cs)(?=(?:.*?(new AppDbContext\(|\.CreateDbContext(Async)?\()){2})'
---
