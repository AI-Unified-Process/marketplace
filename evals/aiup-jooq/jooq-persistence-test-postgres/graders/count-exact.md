---
criterion: "Paging and count"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC010BrowseProductCatalogRepositoryTest\.java.*countCatalog\(\s*\\"[^\\]+\\"\s*\)\)(\s|\\n)*\.isEqualTo\(\s*[1-9]\d*L?\s*\)'
---
