---
criterion: "Cookie decision recorded"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:decisions/ADR-003-[A-Za-z0-9-]+\.md))(?=[^\n]*?(?:[Hh]ttp-?[Oo]nly))(?=[^\n]*?(?:CSRF))(?=[^\n]*?(?:[Dd]ouble[- ][Ss]ubmit))'
---
