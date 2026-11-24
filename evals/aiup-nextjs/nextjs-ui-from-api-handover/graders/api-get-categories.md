---
criterion: "Calls go through the project's client on relative paths"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*apiGet\b[^;]*/api/products/categories).*src/[\w./-]*\.tsx?'
---
