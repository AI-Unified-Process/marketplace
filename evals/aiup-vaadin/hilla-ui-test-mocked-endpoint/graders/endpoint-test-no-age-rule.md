---
criterion: "Business rules left to the integration layer"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestEndpointTest\.java.*(BR-002|at least 18|minusYears\(\s*1[78]|plusYears|eighteen)'
match: not_contains
---
