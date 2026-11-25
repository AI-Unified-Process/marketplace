---
criterion: "BR-002 left out"
type: regex
weight: 5
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?src/main/java/[^"\s]*\.java|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?src/main/java/[^"\s]*\.java).*class\s+\w*(Closed|Deadline)\w*Exception\b'
match: not_contains
---
