---
criterion: "Fluent API via IEntityTypeConfiguration"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*Domain/[\w./-]*\.cs).*\[(MaxLength|StringLength|Required|Column|Precision|Index)\b'
match: not_contains
---
