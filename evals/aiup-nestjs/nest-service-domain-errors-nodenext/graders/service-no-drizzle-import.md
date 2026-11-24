---
criterion: "No Drizzle in the service"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?"file_path":\s*"[^"]*apps/api/src/guests/guests\.service\.ts".*from\s+(''|\\")(drizzle-orm[^''"\\]*|[./]+[\w./-]*(schema|drizzle\.provider)(\.js)?)(''|\\")'
match: not_contains
---
