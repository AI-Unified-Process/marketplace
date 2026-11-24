---
criterion: "BR-002 validator with marker"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*// UC-020 BR-002:(?:(?!\\n).)*(?:\\n(?:(?!\\n).)*?){1,3}?(withValidator|Validator\.from|Validator<)).*guest/ui/\w+\.java'
---
