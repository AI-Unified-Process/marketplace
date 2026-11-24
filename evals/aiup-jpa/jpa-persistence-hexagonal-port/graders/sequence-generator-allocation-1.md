---
criterion: "Sequence allocation matches the migration"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@SequenceGenerator\([^)]*\\"guest_seq\\")(?=.*@SequenceGenerator\([^)]*allocationSize\s*=\s*1\s*[,)]).*hotel-postgres/src/main/java/[^"]*/guest/model/GuestEntity\.java'
---
