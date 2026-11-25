---
criterion: "Date range query with order"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*Repository\.java.*([Aa]rrivalDate (between|BETWEEN)|ArrivalDateBetween|arrivalDate\s*>=\s*:\w+)'
---
