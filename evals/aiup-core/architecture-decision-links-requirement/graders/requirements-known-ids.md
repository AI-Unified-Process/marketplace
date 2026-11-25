---
criterion: "Linked to the NFR it serves"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:decisions/ADR-003-[A-Za-z0-9-]+\.md))(?=[^\n]*?(?:\*\*Requirements:\*\*(?:[^\\\n]|\\[^n])*?\b(?!(?:FR-00[1-3]|NFR-00[12]|C-00[12])\b)(?:NFR|FR|C)-\d+))'
match: not_contains
---
