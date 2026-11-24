---
criterion: "No file changed"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"(?:Write|Edit|NotebookEdit)",\s*"input":\s*\{(?![^\n]*"file_path":\s*"[^"]*session-log\.md")'
match: not_contains
---
