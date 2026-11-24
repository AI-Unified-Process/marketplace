---
criterion: "Nothing written or run"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"Skill",\s*"input":\s*\{\s*"skill":\s*"([\w-]+:)?(open-questions|use-case-\w+|test-case[\w-]*|stack|spec-review)"'
match: not_contains
---
