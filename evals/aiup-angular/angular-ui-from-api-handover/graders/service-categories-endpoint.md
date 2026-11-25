---
criterion: "Service calls the handed-over endpoints"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*HttpClient\b)(?=.*/api/products/categories).*src/app/[\w./-]*\.ts'
---
