---
criterion: "Response property names from the contract"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\bguestId\b)(?=.*\bgivenName\b)(?=.*\bfamilyName\b)(?=.*\bemailAddress\b)[^\n]*?\brecord\s+\w*(Response|Registered)\w*\s*\('
---
