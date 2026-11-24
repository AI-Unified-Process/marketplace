---
criterion: "No transactions in the repository"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?com/example/shop/persistence/ProductRepository\.java.*(@Transactional|\.transaction(Result)?\()'
match: not_contains
---
