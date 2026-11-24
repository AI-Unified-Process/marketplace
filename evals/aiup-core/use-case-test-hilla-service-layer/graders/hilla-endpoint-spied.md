---
criterion: "Hilla UI tests"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-002-[\w-]+\.test\.tsx.*vi\.spyOn\(\s*RegistrationEndpoint\s*,'
---
