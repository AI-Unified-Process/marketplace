---
criterion: "Only Tested and Done use cases"
type: regex
weight: 5
target: { source: file, path: "session-log.md" }
pattern: '(?=[\s\S]*(UC-003[^\n]{0,120}Implemented|Implemented[^\n]{0,120}UC-003))(?=[\s\S]*(UC-005[^\n]{0,120}Draft|Draft[^\n]{0,120}UC-005))(?=[\s\S]*(UC-006[^\n]{0,120}Approved|Approved[^\n]{0,120}UC-006))'
---
