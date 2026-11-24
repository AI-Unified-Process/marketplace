---
criterion: "Sequence allocation matches the migration"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@SequenceGenerator\([^)]*\\"reservation_seq\\")(?=.*@SequenceGenerator\([^)]*allocationSize\s*=\s*1\s*[,)]).*/reservation/Reservation\.java'
---
