---
criterion: "No model or implementation internals"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(?:Write|Edit|Bash)",\s*"input":\s*\{(?!\s*"file_path":\s*"[^"]*session-log\.md")(?![^\n]{0,120}session-log\.md)(?=[^\n]*?(?:docs/test_cases/TC-00[12]-[a-z0-9-]+\.md))(?=[^\n]*?(?:\b(?:Activity|Flow|Gateway|StartEvent|EndEvent|Lane|Participant|Process)_[A-Za-z0-9]+|\bbpmn:|sequenceFlow|userTask|exclusiveGateway|\bbpmndi\b|\b(?:GET|POST|PUT|PATCH|DELETE) /|\bSELECT\b[^\\]{0,80}\bFROM\b|\bINSERT INTO\b|\bUPDATE \w+ SET\b|data-testid|getBy(?:Role|Label|Text)|page\.locator|\.click\(\)|@Test\b|\b[A-Z][A-Za-z]*(?:Service|Repository|Controller|Entity)\b))'
match: not_contains
---
