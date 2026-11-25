---
criterion: "Product EF Core entity created"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*class Product\b)(?=.*\bId\s*\{)(?=.*\bName\s*\{)(?=.*\bCategory\s*\{)(?=.*\bPrice\s*\{)(?=.*\bInStock\s*\{).*[\w./-]*\.cs'
---
