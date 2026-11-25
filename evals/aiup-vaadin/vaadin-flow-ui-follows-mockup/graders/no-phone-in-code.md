---
criterion: "Phone field not built"
type: regex
weight: 10
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)(?![^\n]{0,40}\b(grep|rg)\b)[^\n]*?\.(java|sql)\b[^\n]*?((Field|setHeader|setLabel)\(\s*\\"[Pp]hone|\b[Pp]hone\w*\s*=|::phone\b|\.phone\(|String\s+phone\b|\bphone\w*Field\b|\bphone\s+(varchar|text|character))'
match: not_contains
---
