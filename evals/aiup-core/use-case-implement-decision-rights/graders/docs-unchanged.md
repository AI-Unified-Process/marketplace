---
criterion: "No other docs change and hand-off"
type: regex
weight: 6
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?docs/(use_cases|requirements\.md|entity_model|glossary|architecture/decision-rights)|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?docs/(use_cases|requirements\.md|entity_model|glossary|architecture/decision-rights))'
match: not_contains
---
