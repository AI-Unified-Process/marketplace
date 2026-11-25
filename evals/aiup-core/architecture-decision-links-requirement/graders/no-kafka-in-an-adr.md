---
criterion: "Kafka decision not recorded"
type: regex
weight: 8
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit|NotebookEdit)",\s*"input":\s*\{[^\n]*?"(?:file_path|notebook_path)":\s*"[^"]*decisions/ADR-|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"(?![^\n]{0,120}session-log\.md)(?:[^"\\]|\\.)*?(?:>>?|\btee\b(?:\s+-a)?|\bsed\s+-i[^"\\]*?|\brm\b(?:\s+-\w+)*|\bmv\b)\s*[^\s"]*decisions/ADR-)[^\n]*?[Kk]afka'
match: not_contains
---
