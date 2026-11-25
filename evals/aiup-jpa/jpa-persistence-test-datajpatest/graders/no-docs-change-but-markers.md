---
criterion: "Production code untouched"
type: regex
weight: 3
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*docs/(?!architecture/stack\.md|open_questions\.md)|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*docs/(?!architecture/stack\.md|open_questions\.md))'
match: not_contains
---
