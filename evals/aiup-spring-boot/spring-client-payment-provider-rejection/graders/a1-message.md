---
criterion: "A1 declined mapped"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?\.java.*\\"The payment was declined\. Please use another card\.\\"'
---
