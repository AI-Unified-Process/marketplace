---
criterion: "Specification's button label"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/ui/\w+\.java.*(Button\(\s*\\"Save guest\\"|setText\(\s*\\"Save guest\\")'
match: not_contains
---
