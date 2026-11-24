---
criterion: "Main scenario test present"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*BrowseProductCatalogQuery\(\s*(null|Category:\s*null)?\s*\))(?=.*Assert\.(Equal|Collection|Equivalent)\().*ShopCatalog\.Tests/[\w./-]*\.cs'
---
