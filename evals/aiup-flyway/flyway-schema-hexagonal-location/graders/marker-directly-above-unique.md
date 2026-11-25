---
criterion: "Business rule marker on the unique constraint"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-persistence/src/main/resources/db/migration/V\d+__[a-z0-9_]+\.sql.*-- UC-003 BR-001:(?:[^\\]|\\")*\\n(\s*(CONSTRAINT \w+\s+)?UNIQUE\s*\(\s*email\s*\)|[^\\]*ADD CONSTRAINT \w+\s+UNIQUE\s*\(\s*email\s*\)|\s*email\s[^\\]*UNIQUE|[^\\]*UNIQUE INDEX[^\\]*\(\s*email\s*\))'
---
