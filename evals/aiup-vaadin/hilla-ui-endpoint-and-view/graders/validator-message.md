---
criterion: "BR-002 validator with marker"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*addValidator\()(?=.*(\\"|''|`)The guest must be at least 18 years old(\\"|''|`)).*frontend/views/(?!@layout)[^"\s]*\.tsx'
---
