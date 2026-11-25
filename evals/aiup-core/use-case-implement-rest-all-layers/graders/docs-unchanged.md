---
criterion: "No tests, no docs changed"
type: regex
weight: 4
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?docs/(?!architecture/stack\.md|open_questions\.md)|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?docs/(?!architecture/stack\.md|open_questions\.md))'
match: not_contains
---
