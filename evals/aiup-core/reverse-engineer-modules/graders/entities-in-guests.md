---
criterion: "Entity owned by one module"
type: regex
weight: 1.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*###\s+GUEST\b)(?=.*###\s+LOYALTY_ACCOUNT\b)(?=.*###\s+LOYALTY_TRANSACTION\b)[^\n]*?docs/entity_model/guest[a-z-]*\.md'
---
