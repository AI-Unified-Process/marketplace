---
criterion: "Business rules left to the integration layer"
type: regex
weight: 3
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?ServiceTest\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>>?|tee\s+(-a\s+)?|sed\s+-i\S*\s[^\n]*?)\s*\S*ServiceTest\.java)'
match: not_contains
---
