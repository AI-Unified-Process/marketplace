---
criterion: "Both use cases linked"
type: regex
weight: 4.5
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:## Flow(?:(?!\\n## ).)*?(?:\|\s*\[[^\]]*\]\(\.\./use_cases/UC-005-register-student\.md\)\s*\|)))'
---
