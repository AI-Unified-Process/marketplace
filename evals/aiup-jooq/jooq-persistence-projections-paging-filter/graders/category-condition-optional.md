---
criterion: "Optional category filter"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*PRODUCT\.CATEGORY\.(eq|equal|equalIgnoreCase|in)\()(?=.*(noCondition\(\)|trueCondition\(\)|\w+ (!=|==) null)).*com/example/shop/persistence/ProductRepository\.java'
---
