---
criterion: "Calls go through the project's client on relative paths"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*(openapi-fetch|openapi-typescript|@hey-api/|orval|openapi-generator)'
match: not_contains
---
