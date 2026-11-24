---
criterion: "Journey order carries state"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:## Flow(?:(?!\\n## )(?!UC-006-enroll).)*?\]\(\.\./use_cases/UC-005-register-student\.md\)(?:(?!\\n## ).)*?\]\(\.\./use_cases/UC-006-enroll-in-course\.md\)))'
---
