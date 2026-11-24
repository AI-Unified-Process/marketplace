---
criterion: "Nothing mocked"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/test/[\w/.-]+\.[cm]?ts.*(overrideProvider|vi\.fn\(|vi\.mock\(|vi\.spyOn\(|useValue\s*:)'
match: not_contains
---
