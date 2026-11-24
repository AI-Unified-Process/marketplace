---
criterion: "AI Unified Process data types"
type: regex
weight: 3
target: trace
pattern: '(?:"name":\s*"(?:Write|Edit)",\s*"input":\s*\{\s*"file_path":\s*"[^"]*?docs/entity_model[^"\s]*\.md|"name":\s*"Bash",\s*"input":\s*\{\s*"command":\s*"[^\n]*?(?:>|\btee\s+(?:-a\s+)?)\s*[^\s"]*?docs/entity_model[^"\s]*\.md).*(VARCHAR|varchar|BIGINT|bigint|NUMERIC|BIGSERIAL|bigserial|\bTEXT\b|CHAR\(\d|\|\s*(Money|Timestamp|UUID|Text|Enum|Instant|LocalDate|LocalDateTime|BigDecimal|Double|Float|Short|Number|Email|Identifier)\s*\|)'
match: not_contains
---
