---
criterion: "Testcontainers PostgreSQL, not a mock"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?(apps/api/package\.json[^\n]*@testcontainers/postgresql|(npm|pnpm|yarn)[^\n]*?\b(install|i|add)\b[^\n]*?@testcontainers/postgresql)'
---
