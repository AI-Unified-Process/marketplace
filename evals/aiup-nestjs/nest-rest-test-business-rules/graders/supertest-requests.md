---
criterion: "Nothing mocked"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*from\s+(''|\\")supertest(''|\\"))(?=.*request\(\s*app[\w.()]*)[^\n]*?apps/api/test/UC-010-[\w-]+\.e2e-spec\.ts'
---
