---
criterion: "Category filter tested with exact rows"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*scenario = \\"A2: No Products Match Filter\\".{0,1500}?isEmpty\(\))(?=.*scenario = \\"A2: No Products Match Filter\\".{0,1500}?countCatalog\([^)]*\)\)(\s|\\n)*\.(isZero\(\)|isEqualTo\(\s*0L?\s*\))).*UC010BrowseProductCatalogRepositoryTest\.java'
---
