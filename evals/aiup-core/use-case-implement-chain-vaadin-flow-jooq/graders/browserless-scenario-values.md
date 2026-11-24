---
criterion: "Integration-layer Browserless tests"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@UseCase\(id = \\"UC-001\\")(?=.*scenario = \\"A1: Plot Already Assigned\\")(?=.*scenario = \\"A2: Gardener Holds Two Plots\\").*UC001AssignGardenPlotTest\.java'
---
