---
criterion: "A1 handled with the specified message"
type: regex
weight: 2
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*guest/ui/\w+\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*guest/ui/\w+\.java).*catch\s*\(\s*(final\s+)?(Runtime)?Exception\s+\w+\s*\)'
match: not_contains
---
