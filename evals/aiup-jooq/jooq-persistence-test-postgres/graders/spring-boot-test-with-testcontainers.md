---
criterion: "Real database"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@(SpringBootTest|JooqTest)\b)(?=.*@Import\(\s*\{?[^)]*TestcontainersConfiguration\.class).*UC010BrowseProductCatalogRepositoryTest\.java'
---
