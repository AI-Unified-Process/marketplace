---
criterion: "No production code or documents changed"
type: regex
weight: 5
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*docs/(?!open_questions\.md|architecture/stack\.md)|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*docs/(?!open_questions\.md|architecture/stack\.md))'
match: not_contains
---
