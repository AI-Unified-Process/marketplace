---
criterion: "Test data from the document"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\\"John\\")(?=.*(1988-01-09|09/01/1988|01/09/1988|LocalDate\.of\(\s*1988\s*,\s*(0?1|Month\.JANUARY)\s*,\s*0?9\s*\))).*TC003\w*IT\.java'
---
