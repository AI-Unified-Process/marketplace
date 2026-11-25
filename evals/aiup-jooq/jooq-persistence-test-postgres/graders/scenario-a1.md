---
criterion: "@UseCase on every method"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC010BrowseProductCatalogRepositoryTest\.java.*@UseCase\(\s*id = \\"UC-010\\",\s*scenario = \\"A1: Filter by Category\\"'
---
