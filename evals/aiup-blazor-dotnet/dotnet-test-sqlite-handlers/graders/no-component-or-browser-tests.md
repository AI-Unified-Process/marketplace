---
criterion: "Backend tests only"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*(using Bunit;|using Microsoft\.Playwright|BunitContext|Include=\\\"bunit\\\")'
match: not_contains
---
