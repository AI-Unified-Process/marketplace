---
criterion: "Records.mapping into a Java record"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?com/example/shop/persistence/ProductRepository\.java.*PRODUCT\.ID,\s*PRODUCT\.NAME,\s*PRODUCT\.CATEGORY,\s*PRODUCT\.PRICE.{0,400}?(Records\.)?mapping\(\s*\w+::new\s*\)'
---
