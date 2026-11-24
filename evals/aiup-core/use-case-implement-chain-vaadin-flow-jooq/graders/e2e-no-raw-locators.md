---
criterion: "E2E test per the E2E scope"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001AssignGardenPlotIT\.java.*page\.locator\('
match: not_contains
---
