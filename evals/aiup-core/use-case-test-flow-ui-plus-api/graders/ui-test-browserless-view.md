---
criterion: "UI tests cover the whole use case"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002RegisterForWorkshopTest\.java(?=.*extends\s+SpringBrowserlessTest\b).*RegisterForWorkshopView\b'
---
