---
criterion: "Exact messages"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*hasMessageContaining\('
match: not_contains
---
