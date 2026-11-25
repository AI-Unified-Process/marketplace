---
criterion: "Cookie decision recorded"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:decisions/ADR-003-[A-Za-z0-9-]+\.md))(?=[^\n]*?(?:# ADR-003:))(?=[^\n]*?(?:\*\*Status:\*\*\s*Accepted))(?=[^\n]*?(?:\*\*Date:\*\*\s*2026-10-27))'
---
