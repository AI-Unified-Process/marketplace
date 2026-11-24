---
criterion: "Cross-module relationships"
type: regex
weight: 1.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/entity_model/housekeep[a-z-]*\.md.*(ROOM\s+[|}o{]{2}(--|\.\.)[|}o{]{2}\s+CLEANING_TASK\b|CLEANING_TASK\s+[|}o{]{2}(--|\.\.)[|}o{]{2}\s+ROOM\b)'
---
