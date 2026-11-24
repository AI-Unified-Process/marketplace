---
criterion: "No web or UI types in the service"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel/(guest/)?\w+(Service|Exception)\.java.*(@ResponseStatus\b|ResponseStatusException|\bHttpStatus\b|EndpointException)'
match: not_contains
---
