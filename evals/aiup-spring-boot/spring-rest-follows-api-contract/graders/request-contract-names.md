---
criterion: "Request property names from the contract"
type: regex
weight: 8
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\bgivenName\b)(?=.*\bfamilyName\b)(?=.*\bemailAddress\b)(?=.*\bdateOfBirth\b)(?=.*\barrivalDate\b)[^\n]*?\brecord\s+\w+\s*\('
---
