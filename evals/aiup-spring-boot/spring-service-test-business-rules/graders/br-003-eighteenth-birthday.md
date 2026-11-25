---
criterion: "BR-003 boundary cases"
type: regex
weight: 5
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC001RegisterGuestServiceTest\.java.*(?:(minusYears|plusYears)\(\s*18\s*\)(?!\s*(\\n|\s)*\.(plus|minus)Days)|(?=.*?LocalDate\.of\(\s*2024,\s*(\d+),\s*(\d+)\s*\))(?=.*?LocalDate\.of\(\s*2006,\s*\5,\s*\6\s*\))|(?=.*?LocalDate\.of\(\s*2025,\s*(\d+),\s*(\d+)\s*\))(?=.*?LocalDate\.of\(\s*2007,\s*\7,\s*\8\s*\))|(?=.*?LocalDate\.of\(\s*2026,\s*(\d+),\s*(\d+)\s*\))(?=.*?LocalDate\.of\(\s*2008,\s*\9,\s*\10\s*\))|(?=.*?LocalDate\.of\(\s*2027,\s*(\d+),\s*(\d+)\s*\))(?=.*?LocalDate\.of\(\s*2009,\s*\11,\s*\12\s*\))|(?=.*?LocalDate\.of\(\s*2028,\s*(\d+),\s*(\d+)\s*\))(?=.*?LocalDate\.of\(\s*2010,\s*\13,\s*\14\s*\))|(?=.*?LocalDate\.of\(\s*2029,\s*(\d+),\s*(\d+)\s*\))(?=.*?LocalDate\.of\(\s*2011,\s*\15,\s*\16\s*\))|(?=.*?LocalDate\.of\(\s*2030,\s*(\d+),\s*(\d+)\s*\))(?=.*?LocalDate\.of\(\s*2012,\s*\17,\s*\18\s*\)))'
---
