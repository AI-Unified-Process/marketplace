---
criterion: "No generator or springdoc added"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?(\.java|pom\.xml|\.gradle(\.kts)?|\.ya?ml|\.properties)\b.*(springdoc|openapi-generator|io\.swagger)'
match: not_contains
---
