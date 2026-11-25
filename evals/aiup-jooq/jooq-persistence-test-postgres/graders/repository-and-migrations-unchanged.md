---
criterion: "No production changes"
type: regex
weight: 7
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*(ProductRepository\.java|src/main/resources/db/migration/)|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*(ProductRepository\.java|src/main/resources/db/migration/))'
match: not_contains
---
