---
criterion: "Migration"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?db/migration/V(?!1__)\d+(_\d+)*__[A-Za-z0-9_]*\.sql.*-- UC-002 BR-003:?[^\\]*\\n\s*(CONSTRAINT\s+\w+\s+UNIQUE|UNIQUE|CREATE UNIQUE INDEX\s+\w+\s+ON\s+\w+)\s*\((?=[^)]*workshop_id)(?=[^)]*email)'
---
