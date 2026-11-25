---
criterion: "DataJpaTest on the real database engine"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@DataJpaTest\b)(?=.*@AutoConfigureTestDatabase\(\s*replace\s*=\s*(AutoConfigureTestDatabase\.)?Replace\.NONE\s*\)).*UC031SearchReservationsRepositoryTest\.java'
---
