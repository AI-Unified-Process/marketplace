---
criterion: "Qualified business rule marker on the email check"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-(postgres|business)/src/main/java/[^"]*/Guest\w*\.java.*// UC-020 BR-001:[^\\]*\\n(\s*@\w+(\([^)]*\))?\s*\\n)*\s*[^\\]*\b\w*[Ee]mail\w*\('
---
