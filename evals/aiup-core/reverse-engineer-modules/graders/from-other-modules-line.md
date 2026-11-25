---
criterion: "Cross-module relationships"
type: regex
weight: 0.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/entity_model/(bill|housekeep)[a-z-]*\.md.*[Ff]rom other modules'
---
