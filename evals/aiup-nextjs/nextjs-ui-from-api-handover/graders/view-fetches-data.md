---
criterion: "Route indirection kept"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*apiGet\b).*src/views/ProductCatalog\.tsx'
---
