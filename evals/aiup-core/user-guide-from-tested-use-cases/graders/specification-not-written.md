---
criterion: "No specification changed"
type: regex
weight: 7
target: trace
pattern: '("name":\s*"(Write|Edit|MultiEdit|NotebookEdit)",\s*"input":\s*\{\s*"(file_path|notebook_path)":\s*"[^"]*docs/(use_cases/|use_cases\.puml|glossary\.md|requirements\.md|entity_model\.md)|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>>?|\btee\s+(-a\s+)?|\bsed\s+-i\S*\s[^\n]*?|\bmv\s+\S+\s+|\bcp\s+\S+\s+|\brm\s+(-\w+\s+)*)\s*\S*docs/(use_cases/|use_cases\.puml|glossary\.md|requirements\.md|entity_model\.md))'
match: not_contains
---
