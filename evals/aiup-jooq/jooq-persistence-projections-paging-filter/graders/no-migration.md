---
criterion: "Layer only"
type: regex
weight: 2
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*db/migration/|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*db/migration/)'
match: not_contains
---
