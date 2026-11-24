---
criterion: "BR-003 enforced at the right boundary with marker"
type: regex
weight: 6
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?guest/\w+Service\.java.*(plusYears\(\s*18\s*\)\s*\.isAfter\(\s*[\w.()]*arrival|[\w.()]*arrival\w*(\(\))?\s*\.minusYears\(\s*18\s*\)\s*\.isBefore\(|plusYears\(\s*18\s*\)\s*\.compareTo\(\s*[\w.()]*arrival[\w.()]*\)\s*>\s*0|Period\.between\([^;]*arrival[^;]*\)\s*\.getYears\(\)\s*<\s*18\b|YEARS\.between\([^;]*arrival[^;]*\)\s*<\s*18\b)'
---
