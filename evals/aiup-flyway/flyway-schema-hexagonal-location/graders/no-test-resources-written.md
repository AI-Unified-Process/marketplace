---
criterion: "No code or tests"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*/src/test/'
match: not_contains
---
