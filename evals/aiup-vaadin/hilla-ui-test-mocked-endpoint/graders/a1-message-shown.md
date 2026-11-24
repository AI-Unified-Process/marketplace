---
criterion: "A1 via EndpointError"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx.*(ByText\(\s*(\\"|\x27|`)Email already registered(\\"|\x27|`)|toHaveTextContent\(\s*(\\"|\x27|`)Email already registered(\\"|\x27|`))'
---
