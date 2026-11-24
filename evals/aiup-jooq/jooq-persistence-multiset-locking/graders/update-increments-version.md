---
criterion: "Optimistic locking on the update"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^"/]*Order[^"/]*Repository\.java.*\.update\(\s*PURCHASE_ORDER\s*\).{0,600}?PURCHASE_ORDER\.VERSION\s*,\s*PURCHASE_ORDER\.VERSION\.(plus|add)\(\s*1\s*\)'
---
