---
criterion: "New ADR with the next free id"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:decisions/ADR-005-[A-Za-z0-9-]+\.md))(?=[^\n]*?(?:# ADR-005:))'
---
