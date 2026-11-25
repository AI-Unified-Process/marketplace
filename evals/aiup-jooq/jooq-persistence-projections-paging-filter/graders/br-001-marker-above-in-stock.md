---
criterion: "BR-001 condition with marker"
type: regex
weight: 13
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?com/example/shop/persistence/ProductRepository\.java.*// UC-010 BR-001:[^\\]*\\n\s*[^\\]*PRODUCT\.IN_STOCK'
---
