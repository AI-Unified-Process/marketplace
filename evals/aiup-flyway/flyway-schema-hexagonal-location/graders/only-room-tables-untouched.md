---
criterion: "Only the missing table"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?"file_path":\s*"[^"]*/V00[12]__'
match: not_contains
---
