---
criterion: "Testable time"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+Service\.java.*(?=.*\bClock\s+\w+)(?=.*(now\(\s*(this\.)?\w*[Cc]lock\s*\)|[Cc]lock\.instant\(\)))'
---
