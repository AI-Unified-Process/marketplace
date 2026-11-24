---
criterion: "Postconditions as cleanup"
type: regex
weight: 2
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*TC003\w*IT\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*TC003\w*IT\.java).*([Dd][Ee][Ll][Ee][Tt][Ee]\s+[Ff][Rr][Oo][Mm]\s+(\w+\.)?[Gg][Uu][Ee][Ss][Tt]\s*(\\"|;|\))|[Tt][Rr][Uu][Nn][Cc][Aa][Tt][Ee]|deleteFrom\(\s*(\w+\.)?GUEST\s*\)\s*\.execute)'
match: not_contains
---
