---
criterion: "Lazy grid against the service"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\.count\(\)).*guest/ui/\w+\.java'
---
