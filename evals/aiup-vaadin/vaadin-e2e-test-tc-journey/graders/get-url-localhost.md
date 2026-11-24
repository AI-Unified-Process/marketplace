---
criterion: "Class name and setup"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*getUrl\(\)\s*\{[^}]*localhost).*TC003\w*IT\.java'
---
