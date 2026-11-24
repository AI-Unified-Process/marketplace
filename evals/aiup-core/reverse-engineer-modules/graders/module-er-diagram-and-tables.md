---
criterion: "Module files with own ER diagram"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/entity_model/[a-z-]+\.md.*erDiagram.*###\s+[A-Z][A-Z_]+'
---
