---
criterion: "Lazy grid against the service"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\.list\(\s*\w+\.getOffset\(\)\s*,\s*\w+\.getLimit\(\)).*guest/ui/\w+\.java'
---
