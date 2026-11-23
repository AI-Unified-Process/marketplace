---
criterion: "JPA persistence with markers"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Repository\.java.*// UC-001 BR-001:[^\\]*\\n\s*(@\w+[^\\]*\\n\s*)*(long|int|Long|Integer) count\w*\('
---
