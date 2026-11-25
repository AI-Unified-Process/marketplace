---
criterion: "Production code untouched"
type: regex
weight: 9
target: trace
pattern: '("name":\s*"(Write|Edit|MultiEdit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*src/main/|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>>?|tee\s+(-a\s+)?|sed\s+-i\S*\s[^\n]*?)\s*\S*src/main/)'
match: not_contains
---
