---
criterion: "Shared transaction handle"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=(?:.*?tx\??\s*:\s*(DbExecutor|Tx|DrizzleDb|[A-Z]\w*)){2})[^\n]*?apps/api/src/orders/[\w.-]+\.repository\.ts'
---
