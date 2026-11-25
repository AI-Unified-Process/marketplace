---
criterion: "Postconditions as cleanup"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@AfterEach)(?=.*([Dd][Ee][Ll][Ee][Tt][Ee]\s+[Ff][Rr][Oo][Mm]\s+(\w+\.)?[Gg][Uu][Ee][Ss][Tt]\s+[Ww][Hh][Ee][Rr][Ee][^;]{0,80}[Ee][Mm][Aa][Ii][Ll]|deleteFrom\(\s*(\w+\.)?GUEST\s*\)[^;]{0,120}EMAIL)).*TC003\w*IT\.java'
---
