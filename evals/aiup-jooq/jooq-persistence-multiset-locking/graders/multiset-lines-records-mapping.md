---
criterion: "MULTISET for the lines"
type: regex
weight: 14
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^"/]*Order[^"/]*Repository\.java.*multiset\(.{0,600}?ORDER_LINE.{0,1500}?\.convertFrom\(.{0,300}?(Records\.)?mapping\(\s*\w+::new'
---
