---
criterion: "AI Unified Process data types"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?docs/entity_model/[a-z-]+\.md.*\|\s*Attribute\s*\|\s*Description\s*\|\s*Data Type\s*\|\s*Length/Precision\s*\|\s*Validation Rules\s*\|'
---
