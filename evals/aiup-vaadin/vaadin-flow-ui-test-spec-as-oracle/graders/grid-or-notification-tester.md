---
criterion: "Browserless API used correctly"
type: regex
weight: 1
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?UC020RegisterGuestTest\.java.*\btest\(\s*(\w*([Gg]rid|[Nn]otification)\w*|(\$|find)\(\s*(Grid|Notification)\.class[^;]*?)\)\s*\.\s*(getCellText|getRow|size|getText)\('
---
