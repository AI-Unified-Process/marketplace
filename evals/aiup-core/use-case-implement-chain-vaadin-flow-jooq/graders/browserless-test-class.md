---
criterion: "Integration-layer Browserless tests"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*extends SpringBrowserlessTest)(?=.*@SpringBootTest)(?=.*TestcontainersConfiguration).*UC001AssignGardenPlotTest\.java'
---
