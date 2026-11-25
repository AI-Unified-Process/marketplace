---
criterion: "A1 rejection message at the endpoint"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestEndpointTest\.java.*(anna\.berger|luca\.rossi|mia\.weber)@example\.com'
---
