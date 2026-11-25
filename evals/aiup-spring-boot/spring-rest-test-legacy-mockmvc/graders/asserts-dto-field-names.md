---
criterion: "Created with Location and JSON contract"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java(?=.*\$\.firstName\b).*\$\.(email|lastName)\b'
---
