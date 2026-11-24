---
criterion: "Optimistic locking on the update"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^"/]*Order[^"/]*Repository\.java.*\.update\(\s*PURCHASE_ORDER\s*\).{0,600}?(\.where|\.and)\([^;]{0,200}?PURCHASE_ORDER\.VERSION\.(eq|equal)\('
---
