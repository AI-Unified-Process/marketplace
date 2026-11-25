---
criterion: "@UseCase on every method"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC010BrowseProductCatalogRepositoryTest\.java.*(\{|;|\}|\*/)(\s|\\n)*@Test(\(\))?(\s|\\n)*(public |protected )?void '
match: not_contains
---
