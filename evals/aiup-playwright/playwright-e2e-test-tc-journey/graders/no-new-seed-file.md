---
criterion: "Seed data not duplicated"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*\.sql"'
match: not_contains
---
