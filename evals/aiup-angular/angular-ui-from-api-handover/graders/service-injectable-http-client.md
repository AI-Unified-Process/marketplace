---
criterion: "Service calls the handed-over endpoints"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*@Injectable\()(?=.*HttpClient\b)(?=.*\.get<).*src/app/[\w./-]*\.ts'
---
