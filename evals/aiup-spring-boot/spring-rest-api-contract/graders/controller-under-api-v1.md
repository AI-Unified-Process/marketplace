---
criterion: "Base path from the API contract"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Controller\.java.*\\"/api/v1(/guests)?/?\\"'
---
