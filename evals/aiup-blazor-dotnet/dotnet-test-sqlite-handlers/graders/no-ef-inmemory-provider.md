---
criterion: "SQLite in-memory, not UseInMemoryDatabase"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*(\.UseInMemoryDatabase\s*\(|Include=\\\"Microsoft\.EntityFrameworkCore\.InMemory|add package Microsoft\.EntityFrameworkCore\.InMemory|using Microsoft\.EntityFrameworkCore\.InMemory)'
match: not_contains
---
