---
criterion: "Expected values from the test case"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?=.*Clean Architecture Basics)(?=.*(2027-03-15|15\.03\.2027|15/03/2027|03/15/2027|LocalDate(Time)?\.of\(\s*2027\s*,\s*(0?3|Month\.MARCH)\s*,\s*15))(?=.*\\"Ada Keller\\")(?=.*\\"ada\.keller@example\.com\\").*TC001\w*IT\.java'
---
