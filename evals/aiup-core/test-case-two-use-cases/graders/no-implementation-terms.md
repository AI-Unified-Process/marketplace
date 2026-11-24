---
criterion: "No implementation detail"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-001-[a-z0-9-]+\.md))(?=[^\n]*?(?:\b(?:GET|POST|PUT|PATCH|DELETE) /|\bSELECT\b[^\\]{0,80}\bFROM\b|\bINSERT INTO\b|\bUPDATE \w+ SET\b|data-testid|getBy(?:Role|Label|Text)|page\.locator|\.click\(\)|@Test\b|\b[A-Z][A-Za-z]*(?:Service|Repository|Controller|Entity)\b))'
match: not_contains
---
