---
criterion: "MULTISET for the lines"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?[^"/]*Order[^"/]*Repository\.java.*multiset\(.*\.(fetchOptional|fetchOne|fetchSingle|fetch)\(\s*(Records\.)?mapping\(\s*\w+::new'
---
