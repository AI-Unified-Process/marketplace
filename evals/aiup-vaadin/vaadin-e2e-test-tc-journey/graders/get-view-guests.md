---
criterion: "Class name and setup"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*getView\(\)\s*\{[^}]*return\s+\\"/?guests\\").*TC003\w*IT\.java'
---
