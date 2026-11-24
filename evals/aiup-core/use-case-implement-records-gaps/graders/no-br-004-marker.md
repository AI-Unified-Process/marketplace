---
criterion: "BR-004 not guessed"
type: regex
weight: 5
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?src/main/[^"\s]*\.(java|sql)|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?src/main/[^"\s]*\.(java|sql)).*UC-002 BR-004'
match: not_contains
---
