---
criterion: "Linked to the NFR it serves"
type: regex
weight: 14
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:decisions/ADR-003-[A-Za-z0-9-]+\.md))(?=[^\n]*?(?:\*\*Requirements:\*\*(?:[^\\\n]|\\[^n])*?\bNFR-002\b))'
---
