---
criterion: "Endpoint only delegates"
type: regex
weight: 4
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*com/example/hotel/guest/\w+\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*com/example/hotel/guest/\w+\.java).*@BrowserCallable\b.*(@Transactional|GuestRepository|DSLContext|plusYears|minusYears|existsByEmail|Period\.between|ChronoUnit\.YEARS)'
match: not_contains
---
