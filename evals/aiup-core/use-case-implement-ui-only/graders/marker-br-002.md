---
criterion: "Qualified business rule markers"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?(src/main/java/[^"\s]*\.java|db/migration/[^"\s]*\.sql).*(//|--) UC-002 BR-002\b'
---
