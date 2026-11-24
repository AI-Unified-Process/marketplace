---
criterion: "Fresh DbContext per AAA phase"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(IDbContextFactory<AppDbContext>[^\n]*?CreateDbContext\(\)\s*(=>\s*new\b|\{\s*(\\n\s*)*return\s+new\b)|new PooledDbContextFactory<AppDbContext>\()).*ShopCatalog\.Tests/[\w./-]*\.cs'
---
