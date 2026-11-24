---
criterion: "Route indirection kept"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(\\\"|'')use client(\\\"|''))(?=.*use(State|Effect|Transition)\b).*src/views/ProductCatalog\.tsx'
---
