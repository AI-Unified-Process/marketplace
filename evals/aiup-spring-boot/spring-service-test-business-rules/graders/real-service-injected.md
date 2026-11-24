---
criterion: "Real call chain, no mocks"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*(@Autowired(\\n|\s)*(private\s+)?(final\s+)?GuestService\s+\w+|\bGuestService\s+\w+\s*[,)])'
---
