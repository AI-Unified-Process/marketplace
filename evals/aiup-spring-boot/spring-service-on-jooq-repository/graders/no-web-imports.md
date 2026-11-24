---
criterion: "No web or UI types in the service"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel/(guest/)?\w+(Service|Exception)\.java.*import\s+(static\s+)?(org\.springframework\.web\.|org\.springframework\.http\.|jakarta\.servlet\.|com\.vaadin\.)'
match: not_contains
---
