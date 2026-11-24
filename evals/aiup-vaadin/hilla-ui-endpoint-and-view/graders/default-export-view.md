---
criterion: "File-routed view with ViewConfig"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*export\s+default\s+(function\s+)?\w+View\b).*frontend/views/(?!@layout)[^"\s]*\.tsx'
---
