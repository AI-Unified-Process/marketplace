---
criterion: "Customer-Order relationship mapped"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*class Order\b)(?=.*public long CustomerId\s*\{).*Domain/[\w./-]*\.cs'
---
