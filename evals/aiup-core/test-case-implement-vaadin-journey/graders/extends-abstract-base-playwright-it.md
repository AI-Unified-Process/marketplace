---
criterion: "One journey class"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*class\s+TC001FirstRegistrationIT\s+extends\s+AbstractBasePlaywrightIT\b).*TC001FirstRegistrationIT\.java'
---
