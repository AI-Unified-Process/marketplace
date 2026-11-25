---
criterion: "New ADR content"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:decisions/ADR-005-[A-Za-z0-9-]+\.md))(?=[^\n]*?(?:\*\*Status:\*\*\s*Accepted))(?=[^\n]*?(?:\*\*Date:\*\*\s*2026-10-27))'
---
