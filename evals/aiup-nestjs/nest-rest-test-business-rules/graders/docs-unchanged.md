---
criterion: "No production or docs changes"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?"file_path":\s*"[^"]*/docs/(?!architecture/stack\.md"|open_questions\.md")[^"]*"'
match: not_contains
---
