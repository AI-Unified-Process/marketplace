---
criterion: "No Drizzle in the service"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?apps/api/src/guests/guests\.service\.ts.*\.findByEmail\('
---
