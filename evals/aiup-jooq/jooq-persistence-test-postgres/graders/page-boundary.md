---
criterion: "Paging and count"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC010BrowseProductCatalogRepositoryTest\.java.*findCatalog\([^()]*,\s*[1-9]\d*\s*,\s*\d+\s*\)'
---
