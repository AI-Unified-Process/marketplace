---
criterion: "Rest of UC-002 implemented"
type: regex
weight: 1.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?src/main/java/(?=.*(ProblemDetail|ErrorResponseException|HttpStatus\.CONFLICT|\bCONFLICT\b))(?=.*(FullyBooked|Full|Capacity|Booked)\w*Exception)'
---
