---
criterion: "Handler exercised through its real API"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*new BrowseProductCatalogHandler\()(?=.*\.HandleAsync\()(?=.*new BrowseProductCatalogQuery\().*ShopCatalog\.Tests/[\w./-]*\.cs'
---
