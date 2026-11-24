---
criterion: "Undocumented 409 reported as a gap"
type: regex
weight: 2
target: trace
pattern: '("name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?\.java.*(class\s+\w*(Duplicate|AlreadyCharged|Conflict)\w*Exception|onStatus\((?:(?!onStatus).){0,120}?(\b409\b|CONFLICT|Conflict\b)|case\s+409\b|==\s*409\b))'
match: not_contains
---
