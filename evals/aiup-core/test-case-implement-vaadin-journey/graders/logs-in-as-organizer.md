---
criterion: "Setup per the E2E skill"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\\"organizer\\")(?=.*(Username|Log in|[Ll]ogin)).*TC001\w*IT\.java'
---
