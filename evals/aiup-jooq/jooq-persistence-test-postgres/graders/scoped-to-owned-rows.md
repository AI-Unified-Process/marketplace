---
criterion: "Assertions scoped to owned rows"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(\\"UC010|filteredOn\())(?=.*(containsExactly|isEqualTo)\().*UC010BrowseProductCatalogRepositoryTest\.java'
---
