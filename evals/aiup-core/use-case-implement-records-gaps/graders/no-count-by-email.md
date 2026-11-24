---
criterion: "BR-004 not guessed"
type: regex
weight: 5
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?(Repository|Service)\.java|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?(Repository|Service)\.java).*(count\w*[Ee]mail\w*\(\s*String\s+\w+\s*\)|count\w*\(\s*String\s+\w*[Ee]mail\s*\))'
match: not_contains
---
