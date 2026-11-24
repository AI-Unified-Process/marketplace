---
criterion: "Calls the service, never the repository"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\b\w+View\s*\([^)]*\bGuestService\s+\w+).*guest/ui/\w+\.java'
---
