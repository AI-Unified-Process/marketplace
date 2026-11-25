---
criterion: "Binder form on GuestRegistration"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(forField\(|bindInstanceFields\())(?=.*firstName)(?=.*lastName)(?=.*email)(?=.*dateOfBirth).*guest/ui/\w+\.java'
---
