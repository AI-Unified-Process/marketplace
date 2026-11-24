---
criterion: "Full stack, no mocks"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java.*(@MockitoBean|@MockBean|@Mock\b|Mockito\.mock\(|\bmock\(\s*Guest)'
match: not_contains
---
