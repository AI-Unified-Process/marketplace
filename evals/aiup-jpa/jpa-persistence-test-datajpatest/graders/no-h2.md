---
criterion: "DataJpaTest on the real database engine"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?(pom\.xml.*<artifactId>h2</artifactId>|\.(properties|ya?ml).*jdbc:h2|UC031SearchReservationsRepositoryTest\.java.*jdbc:h2)'
match: not_contains
---
