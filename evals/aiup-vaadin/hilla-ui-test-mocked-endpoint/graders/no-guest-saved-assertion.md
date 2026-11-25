---
criterion: "Main scenario asserts the specified message"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx.*(ByText|toHaveTextContent|toContain|toBe|toEqual)\(\s*(\\"|\x27|`)Guest saved'
match: not_contains
---
