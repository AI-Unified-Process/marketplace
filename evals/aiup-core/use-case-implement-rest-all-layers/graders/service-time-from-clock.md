---
criterion: "Service enforces the rules"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?Service\.java.*(\.now\(\s*(this\.)?\w*[Cc]lock\s*\)|[Cc]lock\.instant\(\)|[Cc]lock\.millis\(\))'
---
