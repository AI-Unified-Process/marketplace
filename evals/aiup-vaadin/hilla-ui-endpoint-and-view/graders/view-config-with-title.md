---
criterion: "File-routed view with ViewConfig"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*export\s+const\s+config\s*:\s*ViewConfig\s*=\s*\{[^}]*(title|menu)).*frontend/views/(?!@layout)[^"\s]*\.tsx'
---
