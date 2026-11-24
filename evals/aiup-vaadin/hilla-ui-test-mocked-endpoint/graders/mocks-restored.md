---
criterion: "Endpoint mocked with vi.spyOn"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?(UC-020-[\w-]+\.test\.tsx|vitest\.config\.[mc]?[jt]s).*(restoreAllMocks\(|mockRestore\(|restoreMocks\s*:\s*true)'
---
