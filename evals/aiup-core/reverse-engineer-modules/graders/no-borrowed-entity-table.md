---
criterion: "Entity owned by one module"
type: regex
weight: 1
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?docs/entity_model/(housekeep|bill)[a-z-]*\.md|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?docs/entity_model/(housekeep|bill)[a-z-]*\.md).*###\s+(ROOM|GUEST|RESERVATION)\b'
match: not_contains
---
