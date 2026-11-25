---
criterion: "Other files unchanged"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(?:Write|Edit|NotebookEdit)",\s*"input":\s*\{[^\n]*?"(?:file_path|notebook_path)":\s*"[^"]*(?:ADR-00[134]-|docs/requirements\.md)|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"(?![^\n]{0,120}session-log\.md)(?:[^"\\]|\\.)*?(?:>>?|\btee\b(?:\s+-a)?|\bsed\s+-i[^"\\]*?|\brm\b(?:\s+-\w+)*|\bmv\b)\s*[^\s"]*(?:ADR-00[134]-|docs/requirements\.md)'
match: not_contains
---
