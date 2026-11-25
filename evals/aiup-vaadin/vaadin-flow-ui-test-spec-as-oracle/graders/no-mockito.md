---
criterion: "No mocks, no back-door data"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestTest\.java.*(Mockito|@MockitoBean|@MockBean|@Mock\b)'
match: not_contains
---
