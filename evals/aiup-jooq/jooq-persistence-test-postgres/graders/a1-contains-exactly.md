---
criterion: "Category filter tested with exact rows"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC010BrowseProductCatalogRepositoryTest\.java.*scenario = \\"A1: Filter by Category\\".{0,1500}?containsExactly\('
---
