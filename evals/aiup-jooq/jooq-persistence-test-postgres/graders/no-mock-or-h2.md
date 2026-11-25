---
criterion: "Real database"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?(UC010BrowseProductCatalogRepositoryTest\.java.*(Mockito|@Mock\b|@MockitoBean|@MockBean|mock\(\s*DSLContext|jdbc:h2|H2Dialect)|pom\.xml.*<artifactId>h2</artifactId>|src/test/resources/[^"]*\.(properties|ya?ml).*jdbc:h2)'
match: not_contains
---
