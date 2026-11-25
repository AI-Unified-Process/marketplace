---
criterion: "@UseCase on every test method"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*@UseCase\((?=[^)]*scenario\s*=\s*\\"A2: Guest Too Young\\")(?=[^)]*\\"BR-003\\")'
---
