---
criterion: "Service tests cover the use case"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC002\w*ServiceTest\.java(?=.*@SpringBootTest\b)(?!.*@Mock\w*(\\n|\s)+(private\s+)?(final\s+)?\w*Repository\b).*RegistrationService\b'
---
