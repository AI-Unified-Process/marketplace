---
criterion: "Mock data uses generated field names"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx(?=.*\bid\s*:)(?=.*\bfirstName\s*:)(?=.*\blastName\s*:)(?=.*\bemail\s*:).*\bdateOfBirth\s*:'
---
