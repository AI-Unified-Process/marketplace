---
criterion: "API tests as the integration layer"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001OrderLunchApiTest\.java.*assert[^;]*[Aa]pprentice'
match: not_contains
---
