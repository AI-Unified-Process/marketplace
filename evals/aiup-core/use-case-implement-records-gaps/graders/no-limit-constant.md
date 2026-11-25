---
criterion: "BR-004 not guessed"
type: regex
weight: 5
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?src/main/[^"\s]*|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?src/main/[^"\s]*).*(MAX_\w*REGISTRATION|max\w*Registrations|registrations-per|registrationsPer|max-registrations|REGISTRATION_LIMIT|registrationLimit|maxActive)'
match: not_contains
---
