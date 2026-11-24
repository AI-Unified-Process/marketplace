---
criterion: "Alternative flow named"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC031SearchReservationsRepositoryTest\.java.*scenario = \\"A1: No Reservations in the Period\\".{0,1500}?isEmpty\(\)'
---
