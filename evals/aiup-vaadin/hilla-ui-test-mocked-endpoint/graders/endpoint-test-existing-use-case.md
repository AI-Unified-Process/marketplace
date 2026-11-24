---
criterion: "Endpoint contract test class"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestEndpointTest\.java(?=.*import\s+com\.example\.hotel\.usecase\.UseCase;).*@UseCase\(\s*id\s*=\s*\\"UC-020\\"'
---
