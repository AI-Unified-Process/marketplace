---
criterion: "Decision forced by test data"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-00[12]-[a-z0-9-]+\.md))(?=[^\n]*?(?:use_cases/UC-022-lend-book\.md))(?![^\n]*?(?:use_cases/UC-023-join-waiting-list\.md))(?=[^\n]*?(?:## Flow(?:(?!\\n## ).)*?(?:Clean Code)))(?![^\n]*?(?:## Flow(?:(?!\\n## ).)*?(?:Refactoring)))'
---
