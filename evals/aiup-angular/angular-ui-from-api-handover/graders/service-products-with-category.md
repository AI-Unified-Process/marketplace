---
criterion: "Service calls the handed-over endpoints"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*HttpClient\b)(?=.*/api/products((\\"|''|`)|\?category=))(?=.*(HttpParams|params|\?category=)).*src/app/[\w./-]*\.ts'
---
