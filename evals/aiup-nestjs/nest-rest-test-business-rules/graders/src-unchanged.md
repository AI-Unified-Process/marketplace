---
criterion: "No production or docs changes"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?"file_path":\s*"[^"]*apps/api/src/'
match: not_contains
---
