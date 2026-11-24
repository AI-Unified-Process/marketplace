---
criterion: "A1 handled with the specified message"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*catch\s*\(\s*(final\s+)?([\w.]+\s*\|\s*)*EmailAlreadyRegisteredException\b)(?=.*(\\"Email already registered\\"|getMessage\(\))).*guest/ui/\w+\.java'
---
