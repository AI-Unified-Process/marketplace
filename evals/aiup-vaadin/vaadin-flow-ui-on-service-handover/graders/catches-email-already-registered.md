---
criterion: "A1 handled with the specified message"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*catch\s*\(\s*(final\s+)?([\w.]+\s*\|\s*)*EmailAlreadyRegisteredException\b).*guest/ui/\w+\.java'
---
