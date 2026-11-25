---
criterion: "CHECK constraint for the range"
type: regex
weight: 12
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/resources/db/migration/V\d+__[a-z0-9_]+\.sql.*CHECK\s*\(\s*(discount\s+BETWEEN\s+0\s+AND\s+50|discount\s*>=\s*0\s+AND\s+discount\s*<=\s*50|discount\s*<=\s*50\s+AND\s+discount\s*>=\s*0)\s*\)'
---
