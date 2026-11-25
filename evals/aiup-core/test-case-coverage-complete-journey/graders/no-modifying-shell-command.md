---
criterion: "No file changed"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"(?![^\n]{0,160}session-log\.md)(?:[^"\\]|\\.)*?(?:\bsed\s+-i\b|\brm\s|\bmv\s|\bgit\s+(?:checkout|restore|commit|stash|apply|am|reset)\b|\bpatch\s|\btee\s|>>?\s*(?!/dev/null|&|\s*/dev/null)[^\s"&|;]*\.(?:java|md|sql|xml|ts|tsx|properties|ya?ml|html|json)\b)'
match: not_contains
---
