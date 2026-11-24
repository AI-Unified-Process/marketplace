---
criterion: "Class name and setup"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@SpringBootTest\(\s*webEnvironment\s*=\s*(SpringBootTest\.)?(WebEnvironment\.)?RANDOM_PORT)(?=.*@LocalServerPort).*TC003\w*IT\.java'
---
