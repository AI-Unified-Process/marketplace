---
criterion: "Unlinked operation not built"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?\.java.*(/availability|queryAvailability)'
match: not_contains
---
