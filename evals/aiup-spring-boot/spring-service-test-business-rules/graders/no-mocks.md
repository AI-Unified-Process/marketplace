---
criterion: "Real call chain, no mocks"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*(@MockitoBean|@MockBean|@MockitoSpyBean|@SpyBean|@Mock\b|Mockito\.mock\(|\bmock\(\s*Guest)'
match: not_contains
---
