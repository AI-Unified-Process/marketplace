---
criterion: "BR-002 left out"
type: regex
weight: 5
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?src/main/java/[^"\s]*\.java|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?src/main/java/[^"\s]*\.java).*(minusHours\(\s*24|plusHours\(\s*24|ofHours\(\s*24|ChronoUnit\.HOURS|Duration\.ofDays\(\s*1\s*\))'
match: not_contains
---
