---
criterion: "Customer and Order entity classes created"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*(#pragma warning disable CS86|#nullable disable|<Nullable>disable)'
match: not_contains
---
