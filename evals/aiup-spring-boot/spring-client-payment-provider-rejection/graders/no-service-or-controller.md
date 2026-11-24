---
criterion: "Scope and markers"
type: regex
weight: 1
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*(Service|Controller)\.java"|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|\btee\s+)\s*\S*(Service|Controller)\.java)'
match: not_contains
---
