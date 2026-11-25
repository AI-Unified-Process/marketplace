---
criterion: "Semantic queries and awaited userEvent"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx.*(?<!await )(?<!await\s\s)\b(user|userEvent)\.(click|type|clear|keyboard|selectOptions|tab|dblClick|hover|paste)\('
match: not_contains
---
