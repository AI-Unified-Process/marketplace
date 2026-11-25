---
criterion: "No other layer touched"
type: regex
weight: 4
target: trace
pattern: '("name":\s*"(Write|Edit)",\s*"input":\s*\{[^\n]*?"file_path":\s*"[^"]*com/example/hotel/guest/(GuestService|GuestRepository|Guest|GuestRegistration|EmailAlreadyRegisteredException)\.java|"name":\s*"Bash",\s*"input":\s*\{[^\n]*?(>|tee\s+(-a\s+)?|sed\s+-i\S*\s+[^\n]{0,200}?|(cp|mv)\s+[^\n]{0,200}?)\s*[^\s"]*com/example/hotel/guest/(GuestService|GuestRepository|Guest|GuestRegistration|EmailAlreadyRegisteredException)\.java)'
match: not_contains
---
