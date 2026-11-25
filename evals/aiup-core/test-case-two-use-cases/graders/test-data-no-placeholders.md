---
criterion: "Literal test data"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:## Flow(?:(?!\\n## ).)*?(?:\b(?:[Aa] valid|[Aa]ny|[Ss]ome) (?:e-?mail|name|student|full name)\b|\[Literal values\]|<[a-z][a-z ]*>)))'
match: not_contains
---
