---
criterion: "Test data from the document"
type: regex
weight: 4
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*\\"Jane\\")(?=.*\\"Doe\\")(?=.*\\"jane\.doe@example\.com\\")(?=.*(1992-05-17|17/05/1992|05/17/1992|LocalDate\.of\(\s*1992\s*,\s*(0?5|Month\.MAY)\s*,\s*17\s*\))).*TC003\w*IT\.java'
---
