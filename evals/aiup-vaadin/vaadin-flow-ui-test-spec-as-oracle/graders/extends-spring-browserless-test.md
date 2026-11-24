---
criterion: "Class name and base class"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestTest\.java.*class\s+UC020RegisterGuestTest\s+extends\s+SpringBrowserlessTest\b'
---
