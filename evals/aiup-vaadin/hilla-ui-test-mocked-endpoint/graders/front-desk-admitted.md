---
criterion: "Role access tested over HTTP"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestEndpointTest\.java.*FRONT_DESK'
---
