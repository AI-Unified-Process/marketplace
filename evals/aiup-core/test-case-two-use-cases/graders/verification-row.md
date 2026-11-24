---
criterion: "Verification steps present"
type: regex
weight: 7
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:## Flow(?:(?!\\n## ).)*?(?:\\n\|\s*\d+\s*\|(?:[^\\\n]|\\[^n])*?\|\s*-\s*\|\s*(?:\\n|$))))'
---
