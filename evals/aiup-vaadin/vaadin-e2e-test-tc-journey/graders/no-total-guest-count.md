---
criterion: "Validation scoped to the journey's rows"
type: regex
weight: 4
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*TC003\w*IT\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*TC003\w*IT\.java).*(getTotalRowCount\(\)[^;]{0,40}(isEqualTo\(\s*([2-9]|\w+\s*\+\s*1)\s*\)|==\s*([2-9]|\w+\s*\+\s*1)\b)|assertEquals\(\s*[2-9]L?\s*,\s*\w+\.getTotalRowCount\(\))'
match: not_contains
---
