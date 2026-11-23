---
criterion: "Migration with the BR-002 marker"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?V002__[a-z0-9_]*lunch_order[a-z0-9_]*\.sql.*-- UC-001 BR-002:[^\\]*\\n\s*(CONSTRAINT \w+ )?UNIQUE ?\(employee_number, ?lunch_date\)'
---
