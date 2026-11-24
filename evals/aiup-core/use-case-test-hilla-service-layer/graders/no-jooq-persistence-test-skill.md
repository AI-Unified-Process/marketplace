---
criterion: "No persistence tests"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"Skill",\s*"input":\s*\{[^\n]*?jooq-persistence-test'
match: not_contains
---
