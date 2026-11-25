---
criterion: "Business rule markers"
type: regex
weight: 2.5
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?src/main/[^"\s]*\.(java|sql)|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?src/main/[^"\s]*\.(java|sql)).*(//|--)\s*BR-\d{3}'
match: not_contains
---
