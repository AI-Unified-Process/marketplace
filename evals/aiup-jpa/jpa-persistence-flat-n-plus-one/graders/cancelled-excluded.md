---
criterion: "Business rule in the query with its marker"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/[^"]*Repository\.java.*(CANCELLED|StatusNot|StatusIsNot|[Ss]tatus\s*(<>|!=)|[Ss]tatus (not in|NOT IN))'
---
