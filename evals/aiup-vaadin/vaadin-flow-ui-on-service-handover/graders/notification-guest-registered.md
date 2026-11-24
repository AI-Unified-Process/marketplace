---
criterion: "Success message verbatim"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*Notification)(?=.*\\"Guest registered\\").*guest/ui/\w+\.java'
---
