---
criterion: "Reduced price not guessed"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/.*[Dd]ish\w*\.(get)?[Pp]rice\(\)'
---
