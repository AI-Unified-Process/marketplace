---
criterion: "Class name and setup"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*class\s+TC003GuestRegistrationDuplicateIT\s+extends\s+AbstractBasePlaywrightIT\b).*TC003GuestRegistrationDuplicateIT\.java'
---
