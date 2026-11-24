---
criterion: "BR-003 enforced at the right boundary with marker"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+Service\.java.*//\s*UC-001 BR-003:'
---
