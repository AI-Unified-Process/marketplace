---
criterion: "Report and no other docs change"
type: regex
weight: 6
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?docs/(use_cases|requirements\.md|entity_model|glossary)|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?docs/(use_cases|requirements\.md|entity_model|glossary))'
match: not_contains
---
