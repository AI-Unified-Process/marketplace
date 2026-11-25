---
criterion: "Product name joined"
type: regex
weight: 9
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^"/]*Order[^"/]*Repository\.java.*multiset\(.{0,600}?(ORDER_LINE\.product\(\)\.NAME|PRODUCT\.NAME)'
---
