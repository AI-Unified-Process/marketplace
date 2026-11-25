---
criterion: "Messages verbatim"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*EndpointError\b)(?=.*\.message\b).*frontend/views/(?!@layout)[^"\s]*\.tsx'
---
