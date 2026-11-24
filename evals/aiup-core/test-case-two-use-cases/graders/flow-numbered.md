---
criterion: "Flow table with five columns"
type: regex
weight: 3
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:## Flow(?:(?!\\n## ).)*?(?:\|\s*Step\s*\|\s*Name\s*\|\s*Description\s*\|\s*Test Data\s*\|\s*Use Case\s*\|\s*\\n\|[-:| ]+\|\s*\\n\|\s*1\s*\|(?:(?!\\n## ).)*?\\n\|\s*2\s*\|(?:(?!\\n## ).)*?\\n\|\s*3\s*\|)))'
---
