---
criterion: "Integration-layer Browserless tests"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*is already assigned for )(?=.*already holds two plots in )(?=.*BR-003).*UC001AssignGardenPlotTest\.java'
---
