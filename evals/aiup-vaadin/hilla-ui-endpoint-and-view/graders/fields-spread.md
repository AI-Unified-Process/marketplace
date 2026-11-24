---
criterion: "useForm with the generated model"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\.\.\.\s*field\(\s*\w+\.firstName\s*\))(?=.*\.\.\.\s*field\(\s*\w+\.lastName\s*\))(?=.*\.\.\.\s*field\(\s*\w+\.email\s*\))(?=.*\.\.\.\s*field\(\s*\w+\.dateOfBirth\s*\)).*frontend/views/(?!@layout)[^"\s]*\.tsx'
---
