---
criterion: "useForm with the generated model"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*useForm\(\s*GuestRegistrationModel\b)(?=.*import\s+(\{[^}]*)?\bGuestRegistrationModel\b[^;]*Frontend/generated/).*frontend/views/(?!@layout)[^"\s]*\.tsx'
---
