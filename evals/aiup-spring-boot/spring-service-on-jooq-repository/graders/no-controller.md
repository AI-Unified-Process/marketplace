---
criterion: "Scope respected"
type: regex
weight: 2
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*\.java".*@(Rest)?Controller\b|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?>\s*\S+\.java[^\n]*?<<[^\n]*?@(Rest)?Controller\b|"name":\s*"(Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*Controller\.java")'
match: not_contains
---
