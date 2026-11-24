---
criterion: "Business-level steps"
type: regex
weight: 8
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?docs/use_cases/[^"\s]*UC-\d{3}-[^"\s]*\.md|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?docs/use_cases/[^"\s]*UC-\d{3}-[^"\s]*\.md).*(\b(POST|GET|PUT|PATCH|DELETE)\s+/|\bprisma\.|\brouter\.|\bawait\s|[\s`(]/(orders|auth|books|reviews|admin)\b(?!\.js))'
match: not_contains
---
