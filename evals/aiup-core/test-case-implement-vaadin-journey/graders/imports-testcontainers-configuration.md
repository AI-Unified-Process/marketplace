---
criterion: "Setup per the E2E skill"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@Import\(\s*(\{\s*)?TestcontainersConfiguration\.class).*TC001\w*IT\.java'
---
