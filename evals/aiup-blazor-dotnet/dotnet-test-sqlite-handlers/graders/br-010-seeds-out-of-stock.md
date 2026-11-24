---
criterion: "BR-010 test present"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*InStock\s*=\s*false).*ShopCatalog\.Tests/[\w./-]*\.cs'
---
