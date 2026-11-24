---
criterion: "Binder form on GuestRegistration"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*(Binder<GuestRegistration>|Binder<>\(\s*GuestRegistration\.class)).*guest/ui/\w+\.java'
---
