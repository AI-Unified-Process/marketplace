---
criterion: "Migration"
type: regex
weight: 2
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?V1__create_workshop\.sql|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?V1__create_workshop\.sql)'
match: not_contains
---
