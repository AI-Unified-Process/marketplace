---
criterion: "Cleanup per the postconditions"
type: regex
weight: 2
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*TC001\w*IT\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*TC001\w*IT\.java).*([Dd][Ee][Ll][Ee][Tt][Ee]\s+[Ff][Rr][Oo][Mm]\s+(\w+\.)?(registration|workshop)\s*(\\"|;|\))|[Tt][Rr][Uu][Nn][Cc][Aa][Tt][Ee]|deleteFrom\(\s*(\w+\.)?(REGISTRATION|WORKSHOP)\s*\)\s*\.execute)'
match: not_contains
---
