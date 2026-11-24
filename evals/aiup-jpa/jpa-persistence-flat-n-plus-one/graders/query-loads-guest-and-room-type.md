---
criterion: "No N+1 selects"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*Repository\.java.*((join|JOIN)\s+(fetch|FETCH)\s+\w+\.guest|@EntityGraph\([^)]*guest|(select|SELECT)\s+(new|NEW)\s.{0,600}?(join|JOIN)\s+\w+\.guest|(join|JOIN)\s+\w+\.guest\s+(as\s+)?\w+.{0,300}?(join|JOIN)\s+\w+\.roomType)'
---
