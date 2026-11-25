---
criterion: "Domain stays free of persistence code"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?hotel-(domain|business)/[^"]*\.java.*import (static )?(jakarta\.persistence|org\.springframework\.data)'
match: not_contains
---
