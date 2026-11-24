---
criterion: "Assertions scoped to owned rows"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC010BrowseProductCatalogRepositoryTest\.java.*(isNotEmpty\(\)|hasSizeGreaterThan(OrEqualTo)?\(|isGreaterThan\(\s*0\s*\)|isPositive\(\))'
match: not_contains
---
