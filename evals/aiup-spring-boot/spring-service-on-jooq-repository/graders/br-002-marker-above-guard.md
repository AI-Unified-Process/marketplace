---
criterion: "BR-002 enforced with qualified marker"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+Service\.java.*//\s*UC-001 BR-002:(?:(?!\\n).)*\\n(\\n|\s)*if\s*\(\s*(this\.)?\w+\.existsByEmail\('
---
