---
criterion: "Layer scope"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?"file_path":\s*"[^"]*(guests\.repository\.ts|database/schema\.ts|/drizzle/)'
match: not_contains
---
