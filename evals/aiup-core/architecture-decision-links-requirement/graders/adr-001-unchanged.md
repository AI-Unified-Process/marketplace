---
criterion: "ADR-002 superseded on both sides"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(?:Write|Edit|NotebookEdit)",\s*"input":\s*\{[^\n]*?"(?:file_path|notebook_path)":\s*"[^"]*ADR-001-|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"(?![^\n]{0,120}session-log\.md)(?:[^"\\]|\\.)*?(?:>>?|\btee\b(?:\s+-a)?|\bsed\s+-i[^"\\]*?|\brm\b(?:\s+-\w+)*|\bmv\b)\s*[^\s"]*ADR-001-'
match: not_contains
---
