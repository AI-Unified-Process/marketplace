---
criterion: "Endpoint mocked with vi.spyOn"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC-020-[\w-]+\.test\.tsx.*(stubGlobal\(\s*(\\"|\x27|`)fetch|(global|globalThis|window)\.fetch\s*=|spyOn\(\s*(global|globalThis|window)\s*,\s*(\\"|\x27|`)fetch|\bmsw\b|setupServer\()'
match: not_contains
---
