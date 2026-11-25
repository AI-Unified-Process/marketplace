---
criterion: "No mocks, no back-door data"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestTest\.java.*(\b\w*([Ss]ervice|[Rr]epository)\w*\.(register|save|insert|create)\w*\(|\.insertInto\(|insert\s+into\s+guest)'
match: not_contains
---
