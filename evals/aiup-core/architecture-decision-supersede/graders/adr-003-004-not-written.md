---
criterion: "New ADR with the next free id"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(?:Write|Edit|NotebookEdit)",\s*"input":\s*\{[^\n]*?"(?:file_path|notebook_path)":\s*"[^"]*ADR-00[34]-|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"(?![^\n]{0,120}session-log\.md)(?:[^"\\]|\\.)*?(?:>>?|\btee\b(?:\s+-a)?|\bsed\s+-i[^"\\]*?|\brm\b(?:\s+-\w+)*|\bmv\b)\s*[^\s"]*ADR-00[34]-'
match: not_contains
---
