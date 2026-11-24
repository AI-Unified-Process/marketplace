---
criterion: "Class name and annotation reuse"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestApiTest\.java.*@UseCase\(\s*id\s*=\s*\\"UC-001\\"'
---
