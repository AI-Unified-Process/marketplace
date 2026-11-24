---
criterion: "Entity owned by one module"
type: regex
weight: 1.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*###\s+INVOICE\b)(?=.*###\s+PAYMENT\b)(?=.*###\s+REFUND\b)[^\n]*?docs/entity_model/bill[a-z-]*\.md'
---
