---
criterion: "Calls the service, never the repository"
type: regex
weight: 6
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*guest/ui/\w+\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*guest/ui/\w+\.java).*(GuestRepository|DSLContext|org\.jooq)'
match: not_contains
---
