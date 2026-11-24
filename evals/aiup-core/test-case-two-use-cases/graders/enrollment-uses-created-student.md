---
criterion: "Journey order carries state"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:(?:(?:Full )?Name[^A-Za-z|\\]{1,8}([A-Z][A-Za-z''-]+ [A-Z][A-Za-z''-]+)(?:[^\\\n]|\\[^n])*?\]\(\.\./use_cases/UC-005-register-student\.md\)(?:(?!\\n## ).)*?\1(?:(?!\\n## ).)*?\]\(\.\./use_cases/UC-006-enroll-in-course\.md\)|\|\s*\**([A-Z][A-Za-z''-]+ [A-Z][A-Za-z''-]+)\b[^|\\]*\|\s*\[[^\]]*\]\(\.\./use_cases/UC-005-register-student\.md\)(?:(?!\\n## ).)*?\2(?:(?!\\n## ).)*?\]\(\.\./use_cases/UC-006-enroll-in-course\.md\)|([A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)(?:[^\\\n]|\\[^n])*?\]\(\.\./use_cases/UC-005-register-student\.md\)(?:(?!\\n## ).)*?\3(?:(?!\\n## ).)*?\]\(\.\./use_cases/UC-006-enroll-in-course\.md\)|(?:registered|created) in step \d(?:(?!\\n## ).)*?\]\(\.\./use_cases/UC-006-enroll-in-course\.md\))))'
---
