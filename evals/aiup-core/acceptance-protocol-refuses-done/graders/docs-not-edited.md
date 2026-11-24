---
criterion: "Nothing else changed"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]{0,40}?"file_path":\s*"([^"]*/)?docs/'
match: not_contains
---
