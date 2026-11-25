---
criterion: "Test data from the use case's test migration"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*(@TestPropertySource|@ActiveProfiles)'
match: not_contains
---
