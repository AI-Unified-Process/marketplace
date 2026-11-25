---
criterion: "Entity owned by one module"
type: regex
weight: 1.5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*###\s+RESERVATION\b)(?=.*###\s+ROOM_TYPE\b)(?=.*###\s+RATE_PLAN\b)[^\n]*?docs/entity_model/reserv[a-z-]*\.md'
---
