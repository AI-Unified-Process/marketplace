---
criterion: "Request property names from the contract"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\bgivenName\b)(?=.*\bdateOfBirth\b)[^\n]*?\.java.*new\s+RegisterGuest\s*\('
---
