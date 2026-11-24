---
criterion: "No persistence or service tests"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"Skill",\s*"input":\s*\{[^\n]*?(jooq-persistence-test|spring-service-test)'
match: not_contains
---
