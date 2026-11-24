---
criterion: "Postconditions cleanup inventory"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:## Postconditions(?:(?!\\n## ).)*?(?:@[A-Za-z0-9-]+\.[A-Za-z]{2,}|[Ss]tudent \\?\"?[A-Z][a-z]+ [A-Z][a-z]+)))'
---
