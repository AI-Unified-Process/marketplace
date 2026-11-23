---
criterion: "Specification and status untouched"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?(use_cases|requirements\.md|glossary\.md|entity_model\.md|use_cases\.puml)'
match: not_contains
---
