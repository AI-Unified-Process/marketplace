---
criterion: "Date range query with order"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*Repository\.java.*(order by|ORDER BY|OrderBy)\s*\w*\.?[Aa]rrivalDate.{0,80}?[Ll]astName'
---
