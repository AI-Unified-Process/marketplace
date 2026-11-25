---
criterion: "No jOOQ types leak"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?com/example/shop/persistence/ProductRepository\.java.*public (Condition|Field<[^>]*>|Result<[^>]*>|Record\d*(<[^>]*>)?|Select\w*(<[^>]*>)?|org\.jooq\.\w+)\s+\w+\(|public [\w<>, ?]+ \w+\([^)]*\b(Condition|Field<|Result<|org\.jooq\.)'
match: not_contains
---
