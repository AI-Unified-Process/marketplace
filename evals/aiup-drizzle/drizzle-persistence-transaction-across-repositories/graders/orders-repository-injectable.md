---
criterion: "Orders repository"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@Injectable\(\))(?=.*@Inject\(\s*DRIZZLE\s*\))[^\n]*?apps/api/src/orders/[\w.-]+\.repository\.ts'
---
