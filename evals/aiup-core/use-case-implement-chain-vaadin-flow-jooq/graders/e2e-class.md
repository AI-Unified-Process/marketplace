---
criterion: "E2E test per the E2E scope"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*extends AbstractBasePlaywrightIT)(?=.*RANDOM_PORT)(?=.*TestcontainersConfiguration).*UC001AssignGardenPlotIT\.java'
---
