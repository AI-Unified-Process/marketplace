---
criterion: "Next version number from the main migrations"
type: regex
weight: 9
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-persistence/src/main/resources/db/migration/V003__(?![a-z0-9_]*(uc_?0*03|register))[a-z0-9_]*guest[a-z0-9_]*\.sql'
---
