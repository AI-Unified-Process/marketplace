---
criterion: "New ALTER TABLE migration"
type: regex
weight: 12
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/resources/db/migration/V002__(?![a-z0-9_]*(uc_?0*12|set_product))[a-z0-9_]*(product|discount)[a-z0-9_]*\.sql.*ALTER TABLE product\b[^;]*ADD (COLUMN )?(IF NOT EXISTS )?discount\b'
---
