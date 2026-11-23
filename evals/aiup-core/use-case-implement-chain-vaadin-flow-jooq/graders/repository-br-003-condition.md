---
criterion: "jOOQ repositories"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^\"]*Repository\.java.*// UC-001 BR-003:[^\\]*\\n\s*[^\\]*(closed|CLOSED|status|STATUS|open|OPEN)'
---
