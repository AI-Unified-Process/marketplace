---
criterion: "Response property names from the contract"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Controller\.java.*(ResponseEntity<Guest>|public\s+Guest\s+\w+\s*\(|\bGuestRecord\b)'
match: not_contains
---
