---
criterion: "Status line kept despite the project file"
type: regex
weight: 8
target: trace
pattern: '((?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?docs/use_cases/[^"\s]*UC-002|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?docs/use_cases/[^"\s]*UC-002)|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(sed\s+-i|perl\s+-pi)[^\n]*?UC-002-register)'
match: not_contains
---
