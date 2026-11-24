---
criterion: "Reduced price not guessed"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/.*([Aa]pprentice\w*\s*[;=,)]|[Aa]pprentice\w*\s+(BOOLEAN|VARCHAR|DECIMAL|NUMERIC|INT|SMALLINT|CHAR)|[Rr]educed_?[Pp]rice\w*\s*[;=,)(]|REDUCED_PRICE|DISCOUNT|[Dd]iscount\w*\s*[;=,)(])'
match: not_contains
---
