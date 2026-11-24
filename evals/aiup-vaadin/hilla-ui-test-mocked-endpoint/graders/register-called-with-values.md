---
criterion: "Main scenario asserts the specified message"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx.*[Rr]egister\w*\)?\s*\.\s*(to\.have\.been\.calledWith|toHaveBeenCalledWith|toBeCalledWith|calledWith|mock\.calls|toHaveBeenLastCalledWith)'
---
