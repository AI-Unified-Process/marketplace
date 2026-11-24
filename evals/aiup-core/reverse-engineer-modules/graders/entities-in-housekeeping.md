---
criterion: "Entity owned by one module"
type: regex
weight: 1.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*###\s+HOUSEKEEPER\b)(?=.*###\s+CLEANING_TASK\b)(?=.*###\s+MAINTENANCE_REQUEST\b)[^\n]*?docs/entity_model/housekeep[a-z-]*\.md'
---
