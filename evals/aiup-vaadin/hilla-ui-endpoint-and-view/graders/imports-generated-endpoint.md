---
criterion: "Generated client, no fetch"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*import\s*\{[^}]*\w+Endpoint[^}]*\}\s*from\s*(\\"|''|`)Frontend/generated/endpoints(\.js)?(\\"|''|`)).*frontend/views/(?!@layout)[^"\s]*\.tsx'
---
