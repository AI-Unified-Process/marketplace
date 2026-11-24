---
criterion: "Configuration without credentials in code"
type: regex
weight: 2
target: trace
pattern: '"name":\s*"(Write|Edit|Bash)",\s*"input":\s*\{(?![^\n]{0,80}session-log\.md)[^\n]*?application[\w-]*\.(yml|yaml|properties).*api[-_]?[Kk]ey\s*[:=][ \t]*(?!\$\{|\\"\$\{|\\n|\\")[^\s\\]'
match: not_contains
---
