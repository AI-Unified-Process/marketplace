---
criterion: "@UseCase on every test method"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestTest\.java.*@UseCase\(\s*id\s*=\s*\\"UC-020\\"'
---
