---
criterion: "E2E test per the E2E scope"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@DisplayName\(\\"UC-001: Assign Garden Plot\\"\))(?=.*@Nested)(?=.*A1: Plot Already Assigned)(?=.*A2: Gardener Holds Two Plots).*UC001AssignGardenPlotIT\.java'
---
