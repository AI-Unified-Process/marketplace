---
criterion: "Layer only"
type: regex
weight: 1
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*(com/example/shop/db/|generated-sources/)|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*(com/example/shop/db/|generated-sources/))'
match: not_contains
---
