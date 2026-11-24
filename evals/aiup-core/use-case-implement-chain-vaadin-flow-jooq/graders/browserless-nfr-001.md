---
criterion: "Integration-layer Browserless tests"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001AssignGardenPlotTest\.java.*requirements = \{\s*\\"NFR-001\\"\s*\}'
---
