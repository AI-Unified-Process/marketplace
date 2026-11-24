---
criterion: "Module files with own ER diagram"
type: regex
weight: 2
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?docs/entity_model/[a-z-]+\.md|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?docs/entity_model/[a-z-]+\.md).*erDiagram(?:(?!```).)*?\b[A-Z][A-Z_]*\s*\{\s*\\n'
match: not_contains
---
