---
criterion: "Domain exceptions with specification messages"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w*([Yy]oung|[Aa]ge|[Mm]inor|[Aa]dult)\w*Exception\.java.*class\s+\w+Exception\s+extends\s+\w+'
---
