---
criterion: "No springdoc added"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?![^\n]{0,40}\b(grep|rg)\b)[^\n]*?(\.java|pom\.xml|\.gradle(\.kts)?)\b.*(springdoc|io\.swagger|@Operation\(|@Tag\(|@ApiResponse)'
match: not_contains
---
