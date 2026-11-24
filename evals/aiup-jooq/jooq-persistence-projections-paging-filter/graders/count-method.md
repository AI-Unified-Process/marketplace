---
criterion: "Paging and count"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?com/example/shop/persistence/ProductRepository\.java.*public (int|long|Integer|Long) \w+\([^)]*\)\s*\{[^}]*(fetchCount\(|selectCount\(\)|count\(\))'
---
