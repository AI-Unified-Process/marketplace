---
criterion: "Grid columns in the mockup's order"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/ui/\w+\.java.*(addColumn\([^)]*(dateOfBirth|::id\b|\.id\(\)|[Pp]hone)|setColumns\([^)]*(dateOfBirth|\\"id\\")|setHeader\(\s*\\"(Date of [Bb]irth|ID|Id|Phone)\\")'
match: not_contains
---
