---
criterion: "Existing products repository extended"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/src/products/products\.repository\.ts.*\.update\(\s*products\s*\)'
---
