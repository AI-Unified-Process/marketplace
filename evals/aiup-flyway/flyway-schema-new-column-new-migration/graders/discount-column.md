---
criterion: "Column from the entity model"
type: regex
weight: 12
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/resources/db/migration/V\d+__[a-z0-9_]+\.sql.*ADD (COLUMN )?(IF NOT EXISTS )?discount\s+INT(EGER)?\s+(NOT NULL\s+DEFAULT\s+0|DEFAULT\s+0\s+NOT NULL)\b'
---
