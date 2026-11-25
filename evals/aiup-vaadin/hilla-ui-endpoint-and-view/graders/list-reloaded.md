---
criterion: "Messages verbatim"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(\.refresh\(\)|\.clearCache\(\)|\b(re)?load\w*\(|\brefresh\w*\(|\bset\w*Guest\w*\(|\bset\w*(Items|Reload|Version)\w*\()).*frontend/views/(?!@layout)[^"\s]*\.tsx'
---
