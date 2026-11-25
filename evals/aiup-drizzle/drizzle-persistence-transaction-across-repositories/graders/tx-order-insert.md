---
criterion: "Shared transaction handle"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/src/orders/[\w.-]+\.repository\.ts.*\btx(\\n\s*)?\s*\.insert\(\s*purchaseOrders\s*\)'
---
