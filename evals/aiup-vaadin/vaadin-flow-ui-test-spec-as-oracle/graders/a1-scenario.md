---
criterion: "@UseCase on every test method"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestTest\.java.*@UseCase\([^)]*scenario\s*=\s*\\"A1: Email Already Registered\\"'
---
