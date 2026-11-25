---
criterion: "Category filter tests present (A1 and A2)"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*BrowseProductCatalogQuery\(\s*(Category:\s*)?(\\\"|\w))(?=.*Assert\.Empty\().*ShopCatalog\.Tests/[\w./-]*\.cs'
---
