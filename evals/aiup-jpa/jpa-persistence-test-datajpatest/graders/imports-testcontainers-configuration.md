---
criterion: "Reuses the existing Testcontainers setup"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC031SearchReservationsRepositoryTest\.java.*@Import\(\s*\{?[^)]*TestcontainersConfiguration\.class'
---
