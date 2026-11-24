---
criterion: "Phone field not built"
type: regex
weight: 4
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?/Guest(Registration)?\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>>?|tee\s+(-a\s+)?|sed\s+-i\S*\s[^\n]*?)\s*\S*/Guest(Registration)?\.java)'
match: not_contains
---
