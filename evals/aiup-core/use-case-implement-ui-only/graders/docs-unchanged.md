---
criterion: "No tests, no documents"
type: regex
weight: 6
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?docs/(?!architecture/stack\.md|open_questions\.md)|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?docs/(?!architecture/stack\.md|open_questions\.md))'
match: not_contains
---
