---
criterion: "Layer boundaries respected"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*(/backend/|^backend/|/src/main/|docs/(?!(architecture/stack|open_questions)\.md")[^"]*")'
match: not_contains
---
