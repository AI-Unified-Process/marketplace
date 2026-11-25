---
criterion: "BR-002 left out"
type: regex
weight: 5
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?src/main/[^"\s]*\.(java|sql)|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?src/main/[^"\s]*\.(java|sql)).*UC-002 BR-002'
match: not_contains
---
