---
criterion: "Business rule marker"
type: regex
weight: 14
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/resources/db/migration/V\d+__[a-z0-9_]+\.sql.*-- UC-012 BR-001:(?:[^\\]|\\")*\\n[^\\]*(CHECK|CONSTRAINT \w*discount\w*)'
---
