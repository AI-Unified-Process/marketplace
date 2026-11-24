---
criterion: "Postconditions cleanup inventory"
type: regex
weight: 2.5
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-00[12]-[a-z0-9-]+\.md))(?=[^\n]*?(?:use_cases/UC-023-join-waiting-list\.md))(?![^\n]*?(?:use_cases/UC-022-lend-book\.md))(?=[^\n]*?(?:## Postconditions(?:(?!\\n## ).)*?(?:[Rr]eservation|[Ww]aiting list)))(?=[^\n]*?(?:## Postconditions(?:(?!\\n## ).)*?(?:[Ww]aiting[- ]list)))(?=[^\n]*?(?:## Postconditions(?:(?!\\n## ).)*?(?:Refactoring|Mia Keller)))'
---
