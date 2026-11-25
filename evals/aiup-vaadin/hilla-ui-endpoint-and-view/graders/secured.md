---
criterion: "BrowserCallable endpoint"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@BrowserCallable\b)(?=.*@(PermitAll|RolesAllowed)\b).*com/example/hotel/guest/\w+\.java'
---
