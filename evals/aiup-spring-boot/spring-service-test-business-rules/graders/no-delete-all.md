---
criterion: "No @Transactional test, targeted cleanup"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*([Dd][Ee][Ll][Ee][Tt][Ee]\s+[Ff][Rr][Oo][Mm]\s+[Gg][Uu][Ee][Ss][Tt](?!\s+[Ww][Hh][Ee][Rr][Ee])|[Tt][Rr][Uu][Nn][Cc][Aa][Tt][Ee]\s|deleteAll\(|deleteFromTables\()'
match: not_contains
---
