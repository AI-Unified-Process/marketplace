---
criterion: "Output path and naming"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:TC-001-[a-z0-9-]*register-student[a-z0-9-]*enroll[a-z0-9-]*\.md))'
match: not_contains
---
