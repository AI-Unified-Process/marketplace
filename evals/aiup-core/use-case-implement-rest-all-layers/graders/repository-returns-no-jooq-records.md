---
criterion: "Persistence"
type: regex
weight: 3
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?Repository\.java|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?Repository\.java).*public\s+(static\s+)?(Optional<|List<)?(Record\d*|Result|\w+Record)\b'
match: not_contains
---
