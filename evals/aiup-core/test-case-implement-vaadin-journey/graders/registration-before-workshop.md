---
criterion: "Cleanup per the postconditions"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@AfterEach)(?=.*([Dd][Ee][Ll][Ee][Tt][Ee]\s+[Ff][Rr][Oo][Mm]\s+(\w+\.)?registration\b.*[Dd][Ee][Ll][Ee][Tt][Ee]\s+[Ff][Rr][Oo][Mm]\s+(\w+\.)?workshop\b|deleteFrom\(\s*(\w+\.)?REGISTRATION\s*\).*deleteFrom\(\s*(\w+\.)?WORKSHOP\s*\))).*TC001\w*IT\.java'
---
