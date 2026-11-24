---
criterion: "Stock check in the update"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/src/products/products\.repository\.ts.*\.update\(\s*products\s*\)(?:(?!\.update\()[^;])*?\.where\((?:(?!;)[\s\S])*?(gte\(\s*products\.stock\s*,|products\.stock\}?\s*>=|lt\(\s*products\.stock)'
---
