---
criterion: "Optional category filter"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?com/example/shop/persistence/ProductRepository\.java.*(condition|field|sql|where|and)\(\s*\\"[^\n]{0,120}?\\"\s*\+'
match: not_contains
---
