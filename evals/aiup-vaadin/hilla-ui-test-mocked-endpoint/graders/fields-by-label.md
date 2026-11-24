---
criterion: "Semantic queries and awaited userEvent"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx(?=.*ByLabelText\(\s*(\\"|\x27|`)First name(\\"|\x27|`)).*ByLabelText\(\s*(\\"|\x27|`)(Email|Date of birth|Last name)(\\"|\x27|`)'
---
