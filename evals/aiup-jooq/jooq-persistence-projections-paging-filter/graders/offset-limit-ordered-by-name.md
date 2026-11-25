---
criterion: "Paging and count"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\.offset\()(?=.*\.limit\()(?=.*\.orderBy\(\s*PRODUCT\.NAME).*com/example/shop/persistence/ProductRepository\.java'
---
