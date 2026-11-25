---
criterion: "Route indirection kept"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*src/app/products/page\.tsx).*(apiGet|\bfetch\(|useState|useEffect|<select)'
match: not_contains
---
