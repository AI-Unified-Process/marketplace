---
criterion: "Shared transaction handle"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*tx\??\s*:\s*(DbExecutor|Tx|DrizzleDb|[A-Z]\w*))[^\n]*?apps/api/src/products/products\.repository\.ts.*\btx(\\n\s*)?\s*\.update\(\s*products\s*\)'
---
