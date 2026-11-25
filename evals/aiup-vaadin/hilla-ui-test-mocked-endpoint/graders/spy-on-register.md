---
criterion: "Endpoint mocked with vi.spyOn"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx.*vi\.spyOn\(\s*GuestEndpoint\s*,\s*(\\"|\x27|`)register(\\"|\x27|`)'
---
