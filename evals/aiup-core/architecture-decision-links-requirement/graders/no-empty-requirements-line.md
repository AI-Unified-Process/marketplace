---
criterion: "Kafka decision not recorded"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:decisions/ADR-\d+))(?=[^\n]*?(?:\*\*Requirements:\*\*[ \t]*(?:FR-\d+(?:,[ \t]*FR-\d+)*)?[ \t]*(?:\\n|-|\\u201[34]|[Nn]one|TBD|n/a)))'
match: not_contains
---
