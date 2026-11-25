---
criterion: "File-routed view with ViewConfig"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(//|/\*|\*)\s*UC-020).*frontend/views/(?!@layout)[^"\s]*\.tsx'
---
