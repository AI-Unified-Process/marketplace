---
criterion: "Constraints from the contract schema"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Controller\.java.*(@Valid\s+@RequestBody|@RequestBody\s+@Valid)'
---
